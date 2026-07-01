"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmartAllocationService = void 0;
const entities_1 = require("../../domain/entities");
const enums_1 = require("../../domain/enums");
const ScoringEngine_1 = require("../../domain/services/ScoringEngine");
const ConflictDetectionEngine_1 = require("../../domain/services/ConflictDetectionEngine");
const WorkloadBalancingEngine_1 = require("../../domain/services/WorkloadBalancingEngine");
const BaseService_1 = require("./BaseService");
class SmartAllocationService extends BaseService_1.BaseService {
    constructor(lecturerRepository, courseRepository, allocationRepository, policyRepository, auditLogRepository) {
        super();
        this.lecturerRepository = lecturerRepository;
        this.courseRepository = courseRepository;
        this.allocationRepository = allocationRepository;
        this.policyRepository = policyRepository;
        this.auditLogRepository = auditLogRepository;
        this.scoringEngine = new ScoringEngine_1.ScoringEngine(entities_1.DefaultSystemPolicy);
        this.conflictEngine = new ConflictDetectionEngine_1.ConflictDetectionEngine();
        this.balancingEngine = new WorkloadBalancingEngine_1.WorkloadBalancingEngine();
    }
    async runSmartAllocation(sessionId, assignedBy, options) {
        const session = {
            sessionId,
            status: 'IN_PROGRESS',
            totalCourses: 0,
            allocated: 0,
            failed: 0,
            results: [],
            startedAt: new Date()
        };
        try {
            const policies = await this.getSystemPolicies();
            this.scoringEngine = new ScoringEngine_1.ScoringEngine(policies);
            // Get lecturers and convert to Lecturer class instances
            const lecturerData = await this.lecturerRepository.findActive();
            const lecturers = lecturerData.map(l => new entities_1.Lecturer(l.id, l.staffId, l.name, l.email, l.rank, l.specialization, l.teachingStyle, l.yearsOfExperience, l.maxHours, l.isActive, l.createdAt, l.updatedAt));
            if (lecturers.length === 0) {
                throw new Error('No active lecturers available');
            }
            // Get courses and convert to Course class instances
            const courseData = await this.courseRepository.getUnallocatedCourses();
            const courses = courseData.map(c => new entities_1.Course(c.id, c.code, c.title, c.units, c.level, c.nature, c.lectureHours, c.practicalHours, c.status, c.createdAt, c.updatedAt));
            session.totalCourses = courses.length;
            if (courses.length === 0) {
                session.status = 'COMPLETED';
                session.completedAt = new Date();
                return session;
            }
            // Get current workloads
            const workloads = new Map();
            for (const lecturer of lecturers) {
                const workload = await this.lecturerRepository.getWorkload(lecturer.id);
                workloads.set(lecturer.id, workload);
            }
            // Get existing allocations for conflict detection
            const existingAllocationData = await this.allocationRepository.findActiveAllocations();
            const existingAllocations = existingAllocationData.map(a => new entities_1.Allocation(a.id, a.lecturerId, a.courseId, a.assignedBy, a.status, a.score, a.overrideReason || undefined, a.assignedAt, a.createdAt, a.updatedAt));
            const assignedCourses = [];
            for (const course of courses) {
                const rankedLecturers = this.scoringEngine.rankLecturersForCourse(lecturers, course, workloads);
                if (rankedLecturers.length === 0) {
                    session.failed++;
                    continue;
                }
                let assigned = false;
                for (const ranked of rankedLecturers) {
                    const lecturer = lecturers.find(l => l.id === ranked.lecturerId);
                    if (!lecturer)
                        continue;
                    const currentWorkload = workloads.get(lecturer.id) || 0;
                    const conflicts = this.conflictEngine.detectConflicts(lecturer, course, existingAllocations, currentWorkload);
                    const criticalConflicts = conflicts.filter(c => c.severity === 'CRITICAL');
                    if (criticalConflicts.length > 0) {
                        continue;
                    }
                    const allocation = await this.allocationRepository.create({
                        lecturerId: lecturer.id,
                        courseId: course.id,
                        assignedBy,
                        score: ranked.totalScore,
                        status: enums_1.AllocationStatus.AUTO_ALLOCATED
                    });
                    workloads.set(lecturer.id, currentWorkload + course.units);
                    // Convert to Allocation class for tracking
                    const newAllocation = new entities_1.Allocation(allocation.id, allocation.lecturerId, allocation.courseId, allocation.assignedBy, allocation.status, allocation.score, allocation.overrideReason || undefined, allocation.assignedAt, allocation.createdAt, allocation.updatedAt);
                    existingAllocations.push(newAllocation);
                    session.results.push(ranked);
                    session.allocated++;
                    assignedCourses.push(course.id);
                    await this.auditLogRepository.create({
                        actionType: 'SMART_ALLOCATION',
                        entity: 'Allocation',
                        entityId: allocation.id,
                        payload: JSON.stringify({
                            sessionId,
                            courseId: course.id,
                            lecturerId: lecturer.id,
                            score: ranked.totalScore,
                            breakdown: ranked.breakdown
                        }),
                        lecturerId: lecturer.id,
                        courseId: course.id,
                        allocationId: allocation.id
                    });
                    assigned = true;
                    break;
                }
                if (!assigned) {
                    session.failed++;
                }
            }
            if (options?.optimizeBalance && session.allocated > 0) {
                await this.optimizeAllocations(sessionId, assignedBy);
            }
            session.status = 'COMPLETED';
            session.completedAt = new Date();
            return session;
        }
        catch (error) {
            session.status = 'FAILED';
            session.completedAt = new Date();
            await this.handleError(error);
            return session;
        }
    }
    async optimizeAllocations(sessionId, assignedBy) {
        try {
            const allocationData = await this.allocationRepository.findActiveAllocations();
            const allocations = allocationData.map(a => new entities_1.Allocation(a.id, a.lecturerId, a.courseId, a.assignedBy, a.status, a.score, a.overrideReason || undefined, a.assignedAt, a.createdAt, a.updatedAt));
            const lecturerData = await this.lecturerRepository.findActive();
            const lecturers = lecturerData.map(l => new entities_1.Lecturer(l.id, l.staffId, l.name, l.email, l.rank, l.specialization, l.teachingStyle, l.yearsOfExperience, l.maxHours, l.isActive, l.createdAt, l.updatedAt));
            const courseData = await this.courseRepository.findActive();
            const courses = courseData.map(c => new entities_1.Course(c.id, c.code, c.title, c.units, c.level, c.nature, c.lectureHours, c.practicalHours, c.status, c.createdAt, c.updatedAt));
            const distribution = this.balancingEngine.calculateDistribution(lecturers, allocations, courses);
            const analysis = this.balancingEngine.analyzeBalance(distribution);
            const unallocatedCourses = await this.courseRepository.getUnallocatedCourses();
            const unallocated = unallocatedCourses.map(c => new entities_1.Course(c.id, c.code, c.title, c.units, c.level, c.nature, c.lectureHours, c.practicalHours, c.status, c.createdAt, c.updatedAt));
            const optimization = this.balancingEngine.optimizeDistribution(distribution, unallocated);
            for (const assignment of optimization.assignments) {
                const allocation = await this.allocationRepository.create({
                    lecturerId: assignment.suggestedLecturerId,
                    courseId: assignment.courseId,
                    assignedBy,
                    status: enums_1.AllocationStatus.AUTO_ALLOCATED
                });
                await this.auditLogRepository.create({
                    actionType: 'OPTIMIZATION',
                    entity: 'Allocation',
                    entityId: allocation.id,
                    payload: JSON.stringify({
                        sessionId,
                        reason: assignment.reason,
                        previousBalanceScore: analysis.balanceScore
                    }),
                    lecturerId: assignment.suggestedLecturerId,
                    courseId: assignment.courseId,
                    allocationId: allocation.id
                });
            }
        }
        catch (error) {
            await this.handleError(error);
        }
    }
    async getSessionReport(sessionId) {
        try {
            const allocations = await this.allocationRepository.findBySession(sessionId);
            if (allocations.length === 0) {
                return {
                    summary: null,
                    distribution: null,
                    recommendations: ['No allocations found for this session'],
                    conflicts: []
                };
            }
            const lecturerIds = [...new Set(allocations.map(a => a.lecturerId))];
            const courseIds = [...new Set(allocations.map(a => a.courseId))];
            const lecturerData = await Promise.all(lecturerIds.map(id => this.lecturerRepository.findById(id)));
            const courseData = await Promise.all(courseIds.map(id => this.courseRepository.findById(id)));
            const validLecturers = lecturerData
                .filter(l => l !== null)
                .map(l => new entities_1.Lecturer(l.id, l.staffId, l.name, l.email, l.rank, l.specialization, l.teachingStyle, l.yearsOfExperience, l.maxHours, l.isActive, l.createdAt, l.updatedAt));
            const validCourses = courseData
                .filter(c => c !== null)
                .map(c => new entities_1.Course(c.id, c.code, c.title, c.units, c.level, c.nature, c.lectureHours, c.practicalHours, c.status, c.createdAt, c.updatedAt));
            const allocationObjects = allocations.map(a => new entities_1.Allocation(a.id, a.lecturerId, a.courseId, a.assignedBy, a.status, a.score, a.overrideReason || undefined, a.assignedAt, a.createdAt, a.updatedAt));
            const distribution = this.balancingEngine.calculateDistribution(validLecturers, allocationObjects, validCourses);
            const analysis = this.balancingEngine.analyzeBalance(distribution);
            const validation = this.conflictEngine.validateAllocationSession(allocationObjects, validLecturers, validCourses);
            return {
                summary: {
                    totalAllocations: allocations.length,
                    totalLecturers: validLecturers.length,
                    totalCourses: validCourses.length,
                    averageUtilization: distribution.reduce((sum, d) => sum + d.utilization, 0) / distribution.length,
                    balanceScore: analysis.balanceScore
                },
                distribution,
                recommendations: analysis.recommendations,
                conflicts: validation.conflicts
            };
        }
        catch (error) {
            await this.handleError(error);
            throw error;
        }
    }
    async getSystemPolicies() {
        try {
            const policies = await this.policyRepository.getSystemPolicies();
            return {
                maxWeeklyHours: policies.maxWeeklyHours || entities_1.DefaultSystemPolicy.maxWeeklyHours,
                allowOverride: policies.allowOverride !== undefined ? policies.allowOverride : entities_1.DefaultSystemPolicy.allowOverride,
                specializationStrictMode: policies.specializationStrictMode !== undefined ? policies.specializationStrictMode : entities_1.DefaultSystemPolicy.specializationStrictMode,
                autoAllocationEnabled: policies.autoAllocationEnabled !== undefined ? policies.autoAllocationEnabled : entities_1.DefaultSystemPolicy.autoAllocationEnabled,
                weights: policies.weights || entities_1.DefaultSystemPolicy.weights
            };
        }
        catch {
            return entities_1.DefaultSystemPolicy;
        }
    }
}
exports.SmartAllocationService = SmartAllocationService;
//# sourceMappingURL=SmartAllocationService.js.map