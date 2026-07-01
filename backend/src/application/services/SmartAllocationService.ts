import { 
  ILecturerRepository, 
  ICourseRepository, 
  IAllocationRepository,
  IPolicyRepository,
  IAuditLogRepository 
} from '../../domain/interfaces/IRepository';
import { ISystemPolicy, DefaultSystemPolicy, Lecturer, Course, Allocation } from '../../domain/entities';
import { AllocationStatus } from '../../domain/enums';
import { ScoringEngine, IScoreResult } from '../../domain/services/ScoringEngine';
import { ConflictDetectionEngine } from '../../domain/services/ConflictDetectionEngine';
import { WorkloadBalancingEngine } from '../../domain/services/WorkloadBalancingEngine';
import { BaseService } from './BaseService';

export interface IAllocationSession {
  sessionId: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  totalCourses: number;
  allocated: number;
  failed: number;
  results: IScoreResult[];
  startedAt: Date;
  completedAt?: Date;
}

export class SmartAllocationService extends BaseService {
  private scoringEngine: ScoringEngine;
  private conflictEngine: ConflictDetectionEngine;
  private balancingEngine: WorkloadBalancingEngine;

  constructor(
    private lecturerRepository: ILecturerRepository,
    private courseRepository: ICourseRepository,
    private allocationRepository: IAllocationRepository,
    private policyRepository: IPolicyRepository,
    private auditLogRepository: IAuditLogRepository
  ) {
    super();
    this.scoringEngine = new ScoringEngine(DefaultSystemPolicy);
    this.conflictEngine = new ConflictDetectionEngine();
    this.balancingEngine = new WorkloadBalancingEngine();
  }

  async runSmartAllocation(
    sessionId: string,
    assignedBy: string,
    options?: {
      optimizeBalance?: boolean;
      maxIterations?: number;
      allowPartialAllocation?: boolean;
    }
  ): Promise<IAllocationSession> {
    const session: IAllocationSession = {
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
      this.scoringEngine = new ScoringEngine(policies);

      // Get lecturers and convert to Lecturer class instances
      const lecturerData = await this.lecturerRepository.findActive();
      const lecturers = lecturerData.map(l => new Lecturer(
        l.id,
        l.staffId,
        l.name,
        l.email,
        l.rank as any,
        l.specialization,
        l.teachingStyle as any,
        l.yearsOfExperience,
        l.maxHours,
        l.isActive,
        l.createdAt,
        l.updatedAt
      ));

      if (lecturers.length === 0) {
        throw new Error('No active lecturers available');
      }

      // Get courses and convert to Course class instances
      const courseData = await this.courseRepository.getUnallocatedCourses();
      const courses = courseData.map(c => new Course(
        c.id,
        c.code,
        c.title,
        c.units,
        c.level,
        c.nature as any,
        c.lectureHours,
        c.practicalHours,
        c.status,
        c.createdAt,
        c.updatedAt
      ));

      session.totalCourses = courses.length;

      if (courses.length === 0) {
        session.status = 'COMPLETED';
        session.completedAt = new Date();
        return session;
      }

      // Get current workloads
      const workloads = new Map<number, number>();
      for (const lecturer of lecturers) {
        const workload = await this.lecturerRepository.getWorkload(lecturer.id);
        workloads.set(lecturer.id, workload);
      }

      // Get existing allocations for conflict detection
      const existingAllocationData = await this.allocationRepository.findActiveAllocations();
      const existingAllocations = existingAllocationData.map(a => new Allocation(
        a.id,
        a.lecturerId,
        a.courseId,
        a.assignedBy,
        a.status as any,
        a.score,
        a.overrideReason || undefined,
        a.assignedAt,
        a.createdAt,
        a.updatedAt
      ));

      const assignedCourses: number[] = [];

      for (const course of courses) {
        const rankedLecturers = this.scoringEngine.rankLecturersForCourse(
          lecturers,
          course,
          workloads
        );

        if (rankedLecturers.length === 0) {
          session.failed++;
          continue;
        }

        let assigned = false;
        for (const ranked of rankedLecturers) {
          const lecturer = lecturers.find(l => l.id === ranked.lecturerId);
          if (!lecturer) continue;

          const currentWorkload = workloads.get(lecturer.id) || 0;
          const conflicts = this.conflictEngine.detectConflicts(
            lecturer,
            course,
            existingAllocations,
            currentWorkload
          );

          const criticalConflicts = conflicts.filter(c => c.severity === 'CRITICAL');
          if (criticalConflicts.length > 0) {
            continue;
          }

          const allocation = await this.allocationRepository.create({
            lecturerId: lecturer.id,
            courseId: course.id,
            assignedBy,
            score: ranked.totalScore,
            status: AllocationStatus.AUTO_ALLOCATED
          });

          workloads.set(lecturer.id, currentWorkload + course.units);
          
          // Convert to Allocation class for tracking
          const newAllocation = new Allocation(
            allocation.id,
            allocation.lecturerId,
            allocation.courseId,
            allocation.assignedBy,
            allocation.status as any,
            allocation.score,
            allocation.overrideReason || undefined,
            allocation.assignedAt,
            allocation.createdAt,
            allocation.updatedAt
          );
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

    } catch (error) {
      session.status = 'FAILED';
      session.completedAt = new Date();
      await this.handleError(error);
      return session;
    }
  }

  private async optimizeAllocations(sessionId: string, assignedBy: string): Promise<void> {
    try {
      const allocationData = await this.allocationRepository.findActiveAllocations();
      const allocations = allocationData.map(a => new Allocation(
        a.id,
        a.lecturerId,
        a.courseId,
        a.assignedBy,
        a.status as any,
        a.score,
        a.overrideReason || undefined,
        a.assignedAt,
        a.createdAt,
        a.updatedAt
      ));

      const lecturerData = await this.lecturerRepository.findActive();
      const lecturers = lecturerData.map(l => new Lecturer(
        l.id,
        l.staffId,
        l.name,
        l.email,
        l.rank as any,
        l.specialization,
        l.teachingStyle as any,
        l.yearsOfExperience,
        l.maxHours,
        l.isActive,
        l.createdAt,
        l.updatedAt
      ));

      const courseData = await this.courseRepository.findActive();
      const courses = courseData.map(c => new Course(
        c.id,
        c.code,
        c.title,
        c.units,
        c.level,
        c.nature as any,
        c.lectureHours,
        c.practicalHours,
        c.status,
        c.createdAt,
        c.updatedAt
      ));

      const distribution = this.balancingEngine.calculateDistribution(
        lecturers,
        allocations,
        courses
      );

      const analysis = this.balancingEngine.analyzeBalance(distribution);
      const unallocatedCourses = await this.courseRepository.getUnallocatedCourses();
      const unallocated = unallocatedCourses.map(c => new Course(
        c.id,
        c.code,
        c.title,
        c.units,
        c.level,
        c.nature as any,
        c.lectureHours,
        c.practicalHours,
        c.status,
        c.createdAt,
        c.updatedAt
      ));

      const optimization = this.balancingEngine.optimizeDistribution(
        distribution,
        unallocated
      );

      for (const assignment of optimization.assignments) {
        const allocation = await this.allocationRepository.create({
          lecturerId: assignment.suggestedLecturerId,
          courseId: assignment.courseId,
          assignedBy,
          status: AllocationStatus.AUTO_ALLOCATED
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

    } catch (error) {
      await this.handleError(error);
    }
  }

  async getSessionReport(sessionId: string): Promise<{
    summary: any;
    distribution: any;
    recommendations: string[];
    conflicts: any[];
  }> {
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

      const lecturerData = await Promise.all(
        lecturerIds.map(id => this.lecturerRepository.findById(id))
      );
      const courseData = await Promise.all(
        courseIds.map(id => this.courseRepository.findById(id))
      );

      const validLecturers = lecturerData
        .filter(l => l !== null)
        .map(l => new Lecturer(
          l!.id,
          l!.staffId,
          l!.name,
          l!.email,
          l!.rank as any,
          l!.specialization,
          l!.teachingStyle as any,
          l!.yearsOfExperience,
          l!.maxHours,
          l!.isActive,
          l!.createdAt,
          l!.updatedAt
        ));

      const validCourses = courseData
        .filter(c => c !== null)
        .map(c => new Course(
          c!.id,
          c!.code,
          c!.title,
          c!.units,
          c!.level,
          c!.nature as any,
          c!.lectureHours,
          c!.practicalHours,
          c!.status,
          c!.createdAt,
          c!.updatedAt
        ));

      const allocationObjects = allocations.map(a => new Allocation(
        a.id,
        a.lecturerId,
        a.courseId,
        a.assignedBy,
        a.status as any,
        a.score,
        a.overrideReason || undefined,
        a.assignedAt,
        a.createdAt,
        a.updatedAt
      ));

      const distribution = this.balancingEngine.calculateDistribution(
        validLecturers,
        allocationObjects,
        validCourses
      );

      const analysis = this.balancingEngine.analyzeBalance(distribution);
      const validation = this.conflictEngine.validateAllocationSession(
        allocationObjects,
        validLecturers,
        validCourses
      );

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

    } catch (error) {
      await this.handleError(error);
      throw error;
    }
  }

  private async getSystemPolicies(): Promise<ISystemPolicy> {
    try {
      const policies = await this.policyRepository.getSystemPolicies();
      return {
        maxWeeklyHours: policies.maxWeeklyHours || DefaultSystemPolicy.maxWeeklyHours,
        allowOverride: policies.allowOverride !== undefined ? policies.allowOverride : DefaultSystemPolicy.allowOverride,
        specializationStrictMode: policies.specializationStrictMode !== undefined ? policies.specializationStrictMode : DefaultSystemPolicy.specializationStrictMode,
        autoAllocationEnabled: policies.autoAllocationEnabled !== undefined ? policies.autoAllocationEnabled : DefaultSystemPolicy.autoAllocationEnabled,
        weights: policies.weights || DefaultSystemPolicy.weights
      };
    } catch {
      return DefaultSystemPolicy;
    }
  }
}