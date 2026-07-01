import { IAllocationService } from '../../domain/interfaces/IService';
import { IAllocationRepository, ILecturerRepository, ICourseRepository, IPolicyRepository, IAuditLogRepository } from '../../domain/interfaces/IRepository';
import { IAllocation } from '../../domain/entities';
import { OverrideAction } from '../../domain/enums';
import { BaseService } from './BaseService';
export declare class AllocationService extends BaseService implements IAllocationService {
    private allocationRepository;
    private lecturerRepository;
    private courseRepository;
    private policyRepository;
    private auditLogRepository;
    constructor(allocationRepository: IAllocationRepository, lecturerRepository: ILecturerRepository, courseRepository: ICourseRepository, policyRepository: IPolicyRepository, auditLogRepository: IAuditLogRepository);
    allocateManually(lecturerId: number, courseId: number, assignedBy: string): Promise<IAllocation>;
    allocateAutomatically(sessionId: string, assignedBy: string): Promise<IAllocation[]>;
    private scoreLecturersForCourse;
    private hasSpecializationMatch;
    private getCourseSpecialization;
    private getSystemPolicies;
    overrideAllocation(allocationId: number, action: OverrideAction, reason: string, actedBy: string, newLecturerId?: number): Promise<IAllocation>;
    getAllocations(): Promise<IAllocation[]>;
    getLecturerAllocations(lecturerId: number): Promise<IAllocation[]>;
    getCourseAllocations(courseId: number): Promise<IAllocation[]>;
    getPendingAllocations(): Promise<IAllocation[]>;
    validateAllocation(lecturerId: number, courseId: number): Promise<{
        valid: boolean;
        message?: string;
        conflicts?: string[];
    }>;
    approveAllocation(allocationId: number, approvedBy: string): Promise<IAllocation>;
    rejectAllocation(allocationId: number, reason: string, rejectedBy: string): Promise<IAllocation>;
    getWorkloadDistribution(): Promise<{
        lecturerId: number;
        name: string;
        currentLoad: number;
        maxLoad: number;
        utilization: number;
    }[]>;
}
