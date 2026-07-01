import { ILecturer, ICourse, IAllocation } from '../entities';
export interface IWorkloadDistribution {
    lecturerId: number;
    name: string;
    currentLoad: number;
    maxLoad: number;
    utilization: number;
    courses: {
        courseId: number;
        code: string;
        title: string;
        units: number;
    }[];
}
export interface IBalanceResult {
    distribution: IWorkloadDistribution[];
    balanceScore: number;
    recommendations: string[];
    overUtilized: number[];
    underUtilized: number[];
}
export declare class WorkloadBalancingEngine {
    /**
     * Calculate workload distribution
     */
    calculateDistribution(lecturers: ILecturer[], allocations: IAllocation[], courses: ICourse[]): IWorkloadDistribution[];
    /**
     * Analyze balance and generate recommendations
     */
    analyzeBalance(distribution: IWorkloadDistribution[]): IBalanceResult;
    /**
     * Optimize workload distribution
     */
    optimizeDistribution(distribution: IWorkloadDistribution[], unallocatedCourses: ICourse[]): {
        assignments: {
            courseId: number;
            suggestedLecturerId: number;
            reason: string;
        }[];
        expectedImprovement: number;
    };
    /**
     * Generate workload summary report
     */
    generateWorkloadSummary(distribution: IWorkloadDistribution[]): string;
}
