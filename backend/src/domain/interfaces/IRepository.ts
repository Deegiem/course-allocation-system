import { ILecturer, ICourse, IAllocation, IPolicy, IAuditLog, IReport } from '../entities';
import { AllocationStatus } from '../enums';

export interface IRepository<T> {
  create(data: Partial<T>): Promise<T>;
  findById(id: number): Promise<T | null>;
  findAll(): Promise<T[]>;
  update(id: number, data: Partial<T>): Promise<T>;
  delete(id: number): Promise<void>;
}

export interface ILecturerRepository extends IRepository<ILecturer> {
  findByStaffId(staffId: string): Promise<ILecturer | null>;
  findByEmail(email: string): Promise<ILecturer | null>;
  findBySpecialization(specialization: string): Promise<ILecturer[]>;
  findActive(): Promise<ILecturer[]>;
  getWorkload(lecturerId: number): Promise<number>;
  getCurrentAllocations(lecturerId: number): Promise<IAllocation[]>;
}

export interface ICourseRepository extends IRepository<ICourse> {
  findByCode(code: string): Promise<ICourse | null>;
  findByLevel(level: number): Promise<ICourse[]>;
  findActive(): Promise<ICourse[]>;
  getUnallocatedCourses(): Promise<ICourse[]>;
}

export interface IAllocationRepository extends IRepository<IAllocation> {
  findByLecturer(lecturerId: number): Promise<IAllocation[]>;
  findByCourse(courseId: number): Promise<IAllocation[]>;
  findByStatus(status: AllocationStatus): Promise<IAllocation[]>;
  findActiveAllocations(): Promise<IAllocation[]>;
  findBySession(sessionId: string): Promise<IAllocation[]>;
  deleteByCourse(courseId: number): Promise<void>;
  deleteByLecturer(lecturerId: number): Promise<void>;
  findPendingAllocations(): Promise<IAllocation[]>;
}

export interface IPolicyRepository extends IRepository<IPolicy> {
  findByKey(key: string): Promise<IPolicy | null>;
  getSystemPolicies(): Promise<Record<string, any>>;
  updateSystemPolicy(key: string, value: any): Promise<IPolicy>;
}

export interface IAuditLogRepository extends IRepository<IAuditLog> {
  findByEntity(entity: string, entityId: number): Promise<IAuditLog[]>;
  findByDateRange(start: Date, end: Date): Promise<IAuditLog[]>;
  findByActionType(actionType: string): Promise<IAuditLog[]>;
  findByLecturer(lecturerId: number): Promise<IAuditLog[]>;
  findByCourse(courseId: number): Promise<IAuditLog[]>;
  findByAllocation(allocationId: number): Promise<IAuditLog[]>;
}

export interface IReportRepository extends IRepository<IReport> {
  findByType(reportType: string): Promise<IReport[]>;
  findByDateRange(start: Date, end: Date): Promise<IReport[]>;
  findByGenerator(generatedBy: string): Promise<IReport[]>;
}