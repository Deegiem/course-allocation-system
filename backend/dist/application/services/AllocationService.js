"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllocationService = void 0;
const entities_1 = require("../../domain/entities");
const enums_1 = require("../../domain/enums");
const BaseService_1 = require("./BaseService");
class AllocationService extends BaseService_1.BaseService {
    constructor(allocationRepository, lecturerRepository, courseRepository, policyRepository, auditLogRepository) {
        super();
        this.allocationRepository = allocationRepository;
        this.lecturerRepository = lecturerRepository;
        this.courseRepository = courseRepository;
        this.policyRepository = policyRepository;
        this.auditLogRepository = auditLogRepository;
    }
    async allocateManually(lecturerId, courseId, assignedBy) {
        try {
            const validation = await this.validateAllocation(lecturerId, courseId);
            if (!validation.valid) {
                throw new Error(validation.message || 'Invalid allocation');
            }
            // ✅ DELETE ALL existing allocations for this course
            await this.allocationRepository.deleteByCourse(courseId);
            // ✅ Create NEW single allocation
            const allocation = await this.allocationRepository.create({
                lecturerId,
                courseId,
                assignedBy,
                status: enums_1.AllocationStatus.APPROVED
            });
            await this.auditLogRepository.create({
                actionType: 'MANUAL_ALLOCATION',
                entity: 'Allocation',
                entityId: allocation.id,
                payload: JSON.stringify({ lecturerId, courseId, assignedBy }),
                lecturerId,
                courseId,
                allocationId: allocation.id
            });
            return allocation;
        }
        catch (error) {
            return await this.handleError(error);
        }
    }
    async allocateAutomatically(sessionId, assignedBy) {
        try {
            const policies = await this.getSystemPolicies();
            const allocations = [];
            // Get all active courses
            const courses = await this.courseRepository.findActive();
            if (courses.length === 0) {
                return [];
            }
            // Get all active lecturers
            const lecturers = await this.lecturerRepository.findActive();
            if (lecturers.length === 0) {
                throw new Error('No active lecturers available for allocation');
            }
            // ✅ IMPORTANT: Get current workloads for ALL lecturers
            const workloads = new Map();
            for (const lecturer of lecturers) {
                const workload = await this.lecturerRepository.getWorkload(lecturer.id);
                workloads.set(lecturer.id, workload);
                console.log(`Initial workload for ${lecturer.name}: ${workload} hours`);
            }
            // Process each course
            for (const course of courses) {
                console.log(`\n--- Processing course: ${course.code} - ${course.title} ---`);
                // Show current workloads before scoring
                for (const lecturer of lecturers) {
                    console.log(`  ${lecturer.name}: ${workloads.get(lecturer.id) || 0} hours`);
                }
                // Score lecturers for this course
                const scoredLecturers = await this.scoreLecturersForCourse(lecturers, course, policies, workloads);
                if (scoredLecturers.length === 0) {
                    console.log(`No eligible lecturers for ${course.code}`);
                    continue;
                }
                // Select the best lecturer (highest score)
                const bestLecturer = scoredLecturers[0];
                console.log(`Selected: ${bestLecturer.name} with score ${bestLecturer.score}`);
                // ✅ Delete any existing allocation for this course
                await this.allocationRepository.deleteByCourse(course.id);
                // ✅ Create new allocation
                const allocation = await this.allocationRepository.create({
                    lecturerId: bestLecturer.lecturerId,
                    courseId: course.id,
                    assignedBy,
                    score: bestLecturer.score,
                    status: enums_1.AllocationStatus.AUTO_ALLOCATED
                });
                // ✅ UPDATE workload for the selected lecturer
                const currentWorkload = workloads.get(bestLecturer.lecturerId) || 0;
                workloads.set(bestLecturer.lecturerId, currentWorkload + course.units);
                console.log(`Updated workload for ${bestLecturer.name}: ${currentWorkload} → ${currentWorkload + course.units}`);
                allocations.push(allocation);
                await this.auditLogRepository.create({
                    actionType: 'AUTO_ALLOCATION',
                    entity: 'Allocation',
                    entityId: allocation.id,
                    payload: JSON.stringify({
                        courseId: course.id,
                        lecturerId: bestLecturer.lecturerId,
                        score: bestLecturer.score,
                        sessionId
                    }),
                    lecturerId: bestLecturer.lecturerId,
                    courseId: course.id,
                    allocationId: allocation.id
                });
            }
            // ✅ FINAL: Log final workload distribution
            console.log('\n--- Final Workload Distribution ---');
            for (const lecturer of lecturers) {
                const finalWorkload = workloads.get(lecturer.id) || 0;
                console.log(`${lecturer.name}: ${finalWorkload} hours`);
            }
            return allocations;
        }
        catch (error) {
            return await this.handleError(error);
        }
    }
    async scoreLecturersForCourse(lecturers, course, policies, workloads) {
        const scored = [];
        const courseSpecialization = this.getCourseSpecialization(course);
        console.log(`Scoring for course: ${course.code} - ${course.title}`);
        console.log(`Course specialization: ${courseSpecialization}`);
        for (const lecturer of lecturers) {
            const currentWorkload = workloads.get(lecturer.id) || 0;
            console.log(`  Checking lecturer: ${lecturer.name}, specialization: ${lecturer.specialization}, current workload: ${currentWorkload}`);
            // Check workload capacity
            if (currentWorkload + course.units > lecturer.maxHours) {
                console.log(`    ❌ Skipped: workload capacity exceeded (${currentWorkload} + ${course.units} > ${lecturer.maxHours})`);
                continue;
            }
            // Check specialization if strict mode is enabled
            if (policies.specializationStrictMode) {
                const hasMatch = this.hasSpecializationMatch(lecturer.specialization, courseSpecialization);
                console.log(`    Specialization match: ${hasMatch}`);
                if (!hasMatch) {
                    console.log(`    ❌ Skipped: no specialization match`);
                    continue;
                }
            }
            // Calculate scores
            const specializationMatch = this.hasSpecializationMatch(lecturer.specialization, courseSpecialization) ? 1 : 0;
            const experienceScore = Math.min(lecturer.yearsOfExperience / 20, 1);
            // Workload balance: lower workload = higher score (but not too aggressive)
            const workloadBalance = Math.max(0, 1 - (currentWorkload / (lecturer.maxHours * 0.8))); // Target 80% utilization
            // Get weights
            const weights = policies.weights || entities_1.DefaultSystemPolicy.weights;
            // Calculate total score
            const score = (specializationMatch * (weights.expertise || 0.40)) +
                (experienceScore * (weights.experience || 0.20)) +
                (workloadBalance * (weights.workload || 0.25)) +
                (0.5 * (weights.preference || 0.10)) +
                (0.5 * (weights.performance || 0.05));
            console.log(`    ✅ Score: ${score.toFixed(3)} (specialization: ${specializationMatch}, experience: ${experienceScore.toFixed(2)}, workload: ${workloadBalance.toFixed(2)})`);
            scored.push({
                lecturerId: lecturer.id,
                score,
                name: lecturer.name,
                specializationMatch,
                experienceScore,
                currentWorkload
            });
        }
        // Sort by score descending
        scored.sort((a, b) => b.score - a.score);
        if (scored.length > 0) {
            console.log(`  Top candidate: ${scored[0].name} with score ${scored[0].score.toFixed(3)}`);
        }
        return scored;
    }
    hasSpecializationMatch(lecturerSpecialization, courseSpecialization) {
        if (!lecturerSpecialization)
            return false;
        // Convert both to arrays of trimmed lowercase strings for comparison
        let lecturerSpecs = [];
        let courseSpecs = [];
        // Handle lecturer specialization
        if (typeof lecturerSpecialization === 'string') {
            lecturerSpecs = lecturerSpecialization.split(',').map(s => s.trim().toLowerCase());
        }
        else if (Array.isArray(lecturerSpecialization)) {
            lecturerSpecs = lecturerSpecialization.map(s => s.trim().toLowerCase());
        }
        else {
            return false;
        }
        // Handle course specialization (might be "Computer Science", "AI", etc.)
        courseSpecs = courseSpecialization.split(',').map(s => s.trim().toLowerCase());
        // Check if any lecturer spec matches any course spec (partial match allowed)
        for (const lecturerSpec of lecturerSpecs) {
            for (const courseSpec of courseSpecs) {
                // Check if one contains the other
                if (lecturerSpec.includes(courseSpec) || courseSpec.includes(lecturerSpec)) {
                    return true;
                }
            }
        }
        return false;
    }
    getCourseSpecialization(course) {
        // Check course code patterns
        if (course.code.includes('CSC') || course.code.includes('CS')) {
            // Return multiple possible specializations for CS courses
            if (course.title.toLowerCase().includes('artificial') || course.title.toLowerCase().includes('machine') || course.title.toLowerCase().includes('ai')) {
                return 'Artificial Intelligence,Machine Learning,AI';
            }
            if (course.title.toLowerCase().includes('data') || course.title.toLowerCase().includes('analytics')) {
                return 'Data Science,Statistics,Analytics';
            }
            if (course.title.toLowerCase().includes('software') || course.title.toLowerCase().includes('engineering')) {
                return 'Software Engineering,Programming,Development';
            }
            if (course.title.toLowerCase().includes('database') || course.title.toLowerCase().includes('management')) {
                return 'Database Systems,Data Management,SQL';
            }
            if (course.title.toLowerCase().includes('network') || course.title.toLowerCase().includes('security')) {
                return 'Computer Networks,Cybersecurity,Information Security';
            }
            if (course.title.toLowerCase().includes('web') || course.title.toLowerCase().includes('development')) {
                return 'Web Development,UI/UX Design,Human-Computer Interaction';
            }
            return 'Computer Science,Programming,Technology';
        }
        return 'General';
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
    async overrideAllocation(allocationId, action, reason, actedBy, newLecturerId) {
        try {
            const allocation = await this.allocationRepository.findById(allocationId);
            if (!allocation) {
                throw new Error(`Allocation with ID ${allocationId} not found`);
            }
            const policies = await this.getSystemPolicies();
            if (!policies.allowOverride) {
                throw new Error('Overrides are disabled by system policy');
            }
            // Determine the new lecturer ID (use existing if not provided)
            const targetLecturerId = newLecturerId || allocation.lecturerId;
            // Validate the new lecturer if provided
            if (newLecturerId) {
                const newLecturer = await this.lecturerRepository.findById(newLecturerId);
                if (!newLecturer) {
                    throw new Error('New lecturer not found');
                }
                if (!newLecturer.isActive) {
                    throw new Error('New lecturer is not active');
                }
                // Check workload capacity for new lecturer
                const currentWorkload = await this.lecturerRepository.getWorkload(newLecturerId);
                const course = await this.courseRepository.findById(allocation.courseId);
                if (course && currentWorkload + course.units > newLecturer.maxHours) {
                    throw new Error(`New lecturer would exceed max workload of ${newLecturer.maxHours} hours`);
                }
            }
            // Get course ID
            const courseId = allocation.courseId;
            // ✅ DELETE all existing allocations for this course
            await this.allocationRepository.deleteByCourse(courseId);
            // ✅ Create NEW allocation with the new lecturer
            const newAllocation = await this.allocationRepository.create({
                lecturerId: targetLecturerId,
                courseId: courseId,
                assignedBy: actedBy,
                status: enums_1.AllocationStatus.OVERRIDDEN,
                overrideReason: reason
            });
            // Log the override in audit
            await this.auditLogRepository.create({
                actionType: `OVERRIDE_${action}`,
                entity: 'Allocation',
                entityId: newAllocation.id,
                payload: JSON.stringify({
                    action,
                    reason,
                    actedBy,
                    oldAllocationId: allocationId,
                    oldLecturerId: allocation.lecturerId,
                    newLecturerId: targetLecturerId
                }),
                lecturerId: targetLecturerId,
                courseId: courseId,
                allocationId: newAllocation.id
            });
            return newAllocation;
        }
        catch (error) {
            return await this.handleError(error);
        }
    }
    async getAllocations() {
        return await this.allocationRepository.findActiveAllocations();
    }
    async getLecturerAllocations(lecturerId) {
        return await this.allocationRepository.findByLecturer(lecturerId);
    }
    async getCourseAllocations(courseId) {
        return await this.allocationRepository.findByCourse(courseId);
    }
    async getPendingAllocations() {
        return await this.allocationRepository.findPendingAllocations();
    }
    async validateAllocation(lecturerId, courseId) {
        const conflicts = [];
        const lecturer = await this.lecturerRepository.findById(lecturerId);
        if (!lecturer) {
            return { valid: false, message: 'Lecturer not found' };
        }
        if (!lecturer.isActive) {
            return { valid: false, message: 'Lecturer is not active' };
        }
        const course = await this.courseRepository.findById(courseId);
        if (!course) {
            return { valid: false, message: 'Course not found' };
        }
        if (!course.status) {
            return { valid: false, message: 'Course is not active' };
        }
        // Check if course is already allocated - warn but don't block
        const existingAllocations = await this.allocationRepository.findByCourse(courseId);
        const activeAllocations = existingAllocations.filter(a => a.status === enums_1.AllocationStatus.AUTO_ALLOCATED ||
            a.status === enums_1.AllocationStatus.APPROVED ||
            a.status === enums_1.AllocationStatus.OVERRIDDEN);
        if (activeAllocations.length > 0) {
            conflicts.push('Course is already allocated. Manual allocation will override the existing allocation.');
        }
        const currentWorkload = await this.lecturerRepository.getWorkload(lecturerId);
        if (currentWorkload + course.units > lecturer.maxHours) {
            conflicts.push(`Lecturer would exceed max workload of ${lecturer.maxHours} hours (current: ${currentWorkload})`);
        }
        const courseSpecialization = this.getCourseSpecialization(course);
        // Helper to check specialization match for validation
        const hasSpecializationMatch = (lecturerSpecialization, courseSpec) => {
            if (!lecturerSpecialization)
                return false;
            if (typeof lecturerSpecialization === 'string') {
                const specs = lecturerSpecialization.split(',').map(s => s.trim().toLowerCase());
                return specs.some(spec => spec.includes(courseSpec.toLowerCase()));
            }
            if (Array.isArray(lecturerSpecialization)) {
                return lecturerSpecialization.some(spec => spec.toLowerCase().includes(courseSpec.toLowerCase()));
            }
            return false;
        };
        if (!hasSpecializationMatch(lecturer.specialization, courseSpecialization)) {
            conflicts.push(`Lecturer does not specialize in ${courseSpecialization}`);
        }
        // Return valid = true even if there are conflicts (warnings)
        // The caller can decide how to handle them
        return {
            valid: true, // Always allow manual allocation
            conflicts: conflicts.length > 0 ? conflicts : undefined,
            message: conflicts.length > 0 ? 'Validation passed with warnings' : undefined
        };
    }
    async approveAllocation(allocationId, approvedBy) {
        try {
            const allocation = await this.allocationRepository.findById(allocationId);
            if (!allocation) {
                throw new Error(`Allocation with ID ${allocationId} not found`);
            }
            const updated = await this.allocationRepository.update(allocationId, {
                status: enums_1.AllocationStatus.APPROVED
            });
            await this.auditLogRepository.create({
                actionType: 'APPROVE_ALLOCATION',
                entity: 'Allocation',
                entityId: allocationId,
                payload: JSON.stringify({ approvedBy }),
                lecturerId: allocation.lecturerId,
                courseId: allocation.courseId,
                allocationId
            });
            return updated;
        }
        catch (error) {
            return await this.handleError(error);
        }
    }
    async rejectAllocation(allocationId, reason, rejectedBy) {
        try {
            const allocation = await this.allocationRepository.findById(allocationId);
            if (!allocation) {
                throw new Error(`Allocation with ID ${allocationId} not found`);
            }
            const updated = await this.allocationRepository.update(allocationId, {
                status: enums_1.AllocationStatus.REJECTED,
                overrideReason: reason
            });
            await this.auditLogRepository.create({
                actionType: 'REJECT_ALLOCATION',
                entity: 'Allocation',
                entityId: allocationId,
                payload: JSON.stringify({ reason, rejectedBy }),
                lecturerId: allocation.lecturerId,
                courseId: allocation.courseId,
                allocationId
            });
            return updated;
        }
        catch (error) {
            return await this.handleError(error);
        }
    }
    async getWorkloadDistribution() {
        const lecturers = await this.lecturerRepository.findActive();
        const distribution = [];
        for (const lecturer of lecturers) {
            const currentLoad = await this.lecturerRepository.getWorkload(lecturer.id);
            distribution.push({
                lecturerId: lecturer.id,
                name: lecturer.name,
                currentLoad,
                maxLoad: lecturer.maxHours,
                utilization: (currentLoad / lecturer.maxHours) * 100
            });
        }
        return distribution.sort((a, b) => b.utilization - a.utilization);
    }
}
exports.AllocationService = AllocationService;
//# sourceMappingURL=AllocationService.js.map