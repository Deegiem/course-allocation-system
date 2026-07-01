import { Allocation, Course, Lecturer } from '../entities';
export interface IConflict {
    type: 'WORKLOAD_OVERFLOW' | 'DUPLICATE_ALLOCATION' | 'SPECIALIZATION_MISMATCH' | 'INACTIVE_LECTURER' | 'INACTIVE_COURSE';
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    message: string;
    lecturerId?: number;
    courseId?: number;
    allocationId?: number;
}
export declare class ConflictDetectionEngine {
    detectConflicts(lecturer: Lecturer, course: Course, existingAllocations: Allocation[], currentWorkload: number): IConflict[];
    validateAllocationSession(allocations: Allocation[], lecturers: Lecturer[], courses: Course[]): {
        isValid: boolean;
        conflicts: IConflict[];
        warnings: string[];
    };
    private getCourseSpecialization;
    generateConflictReport(conflicts: IConflict[]): string;
}
