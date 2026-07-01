import { ILecturer, ICourse, IAllocation, IPolicy, IReport, ISystemPolicy } from '../entities';
import { OverrideAction } from '../enums';
export interface ILecturerService {
    createLecturer(data: Partial<ILecturer>): Promise<ILecturer>;
    updateLecturer(id: number, data: Partial<ILecturer>): Promise<ILecturer>;
    deleteLecturer(id: number): Promise<void>;
    getLecturer(id: number): Promise<ILecturer | null>;
    getAllLecturers(): Promise<ILecturer[]>;
    getActiveLecturers(): Promise<ILecturer[]>;
    getLecturerWorkload(id: number): Promise<number>;
    getLecturerAllocations(id: number): Promise<IAllocation[]>;
    getLecturerByStaffId(staffId: string): Promise<ILecturer | null>;
    getLecturerByEmail(email: string): Promise<ILecturer | null>;
    searchLecturers(query: string): Promise<ILecturer[]>;
}
export interface ICourseService {
    createCourse(data: Partial<ICourse>): Promise<ICourse>;
    updateCourse(id: number, data: Partial<ICourse>): Promise<ICourse>;
    deleteCourse(id: number): Promise<void>;
    getCourse(id: number): Promise<ICourse | null>;
    getAllCourses(): Promise<ICourse[]>;
    getActiveCourses(): Promise<ICourse[]>;
    getCoursesByLevel(level: number): Promise<ICourse[]>;
    getCourseAllocations(id: number): Promise<IAllocation[]>;
    getCourseByCode(code: string): Promise<ICourse | null>;
    getUnallocatedCourses(): Promise<ICourse[]>;
}
export interface IAllocationService {
    allocateManually(lecturerId: number, courseId: number, assignedBy: string): Promise<IAllocation>;
    allocateAutomatically(sessionId: string, assignedBy: string): Promise<IAllocation[]>;
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
export interface IPolicyService {
    getPolicy(key: string): Promise<IPolicy | null>;
    updatePolicy(key: string, value: any): Promise<IPolicy>;
    getSystemPolicies(): Promise<ISystemPolicy>;
    updateSystemPolicies(policies: Partial<ISystemPolicy>): Promise<ISystemPolicy>;
    getDefaultPolicies(): ISystemPolicy;
}
export interface IReportService {
    generateAllocationReport(lecturerId?: number): Promise<IReport>;
    generateWorkloadSummary(): Promise<IReport>;
    generateLevelBasedList(level: number): Promise<IReport>;
    exportToPDF(reportId: number): Promise<string>;
    getReport(reportId: number): Promise<IReport | null>;
    getAllReports(): Promise<IReport[]>;
    getReportsByType(type: string): Promise<IReport[]>;
}
