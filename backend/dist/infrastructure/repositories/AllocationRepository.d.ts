import { PrismaClient } from '@prisma/client';
import { IAllocationRepository } from '../../domain/interfaces/IRepository';
import { IAllocation } from '../../domain/entities';
import { AllocationStatus } from '../../domain/enums';
import { BaseRepository } from './BaseRepository';
export declare class AllocationRepository extends BaseRepository<IAllocation> implements IAllocationRepository {
    constructor(prisma: PrismaClient);
    create(data: Partial<IAllocation>): Promise<IAllocation>;
    update(id: number, data: Partial<IAllocation>): Promise<IAllocation>;
    delete(id: number): Promise<void>;
    findByLecturer(lecturerId: number): Promise<IAllocation[]>;
    findByCourse(courseId: number): Promise<IAllocation[]>;
    findByStatus(status: AllocationStatus): Promise<IAllocation[]>;
    findActiveAllocations(): Promise<IAllocation[]>;
    findBySession(_sessionId: string): Promise<IAllocation[]>;
    deleteByCourse(courseId: number): Promise<void>;
    deleteByLecturer(lecturerId: number): Promise<void>;
    findPendingAllocations(): Promise<IAllocation[]>;
    private mapToEntity;
}
