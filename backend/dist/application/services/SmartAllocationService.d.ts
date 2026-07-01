import { ILecturerRepository, ICourseRepository, IAllocationRepository, IPolicyRepository, IAuditLogRepository } from '../../domain/interfaces/IRepository';
import { IScoreResult } from '../../domain/services/ScoringEngine';
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
export declare class SmartAllocationService extends BaseService {
    private lecturerRepository;
    private courseRepository;
    private allocationRepository;
    private policyRepository;
    private auditLogRepository;
    private scoringEngine;
    private conflictEngine;
    private balancingEngine;
    constructor(lecturerRepository: ILecturerRepository, courseRepository: ICourseRepository, allocationRepository: IAllocationRepository, policyRepository: IPolicyRepository, auditLogRepository: IAuditLogRepository);
    runSmartAllocation(sessionId: string, assignedBy: string, options?: {
        optimizeBalance?: boolean;
        maxIterations?: number;
        allowPartialAllocation?: boolean;
    }): Promise<IAllocationSession>;
    private optimizeAllocations;
    getSessionReport(sessionId: string): Promise<{
        summary: any;
        distribution: any;
        recommendations: string[];
        conflicts: any[];
    }>;
    private getSystemPolicies;
}
