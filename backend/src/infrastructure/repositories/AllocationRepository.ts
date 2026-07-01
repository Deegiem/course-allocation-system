import { PrismaClient } from '@prisma/client';
import { IAllocationRepository } from '../../domain/interfaces/IRepository';
import { Allocation, IAllocation } from '../../domain/entities';
import { AllocationStatus } from '../../domain/enums';
import { BaseRepository } from './BaseRepository';

// Import the Prisma type directly
type PrismaAllocation = {
    id: number;
    lecturerId: number;
    courseId: number;
    score: number | null;
    status: string;
    overrideReason: string | null;
    assignedBy: string;
    assignedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    lecturer?: any;
    course?: any;
};

export class AllocationRepository extends BaseRepository<IAllocation> implements IAllocationRepository {
    constructor(prisma: PrismaClient) {
        super(prisma, 'allocation');
    }

    async create(data: Partial<IAllocation>): Promise<IAllocation> {
        const result = await (this.prisma as any).allocation.create({
            data: {
                lecturerId: data.lecturerId!,
                courseId: data.courseId!,
                score: data.score,
                status: data.status || 'PENDING',
                overrideReason: data.overrideReason,
                assignedBy: data.assignedBy!,
                assignedAt: data.assignedAt || new Date()
            },
            include: { lecturer: true, course: true }
        });
        return this.mapToEntity(result);
    }

    async update(id: number, data: Partial<IAllocation>): Promise<IAllocation> {
        const result = await (this.prisma as any).allocation.update({
            where: { id },
            data: {
                score: data.score,
                status: data.status,
                overrideReason: data.overrideReason,
                assignedBy: data.assignedBy,
                assignedAt: data.assignedAt
            },
            include: { lecturer: true, course: true }
        });
        return this.mapToEntity(result);
    }

    // Add this method if it doesn't exist
    async delete(id: number): Promise<void> {
        await (this.prisma as any).allocation.delete({
            where: { id }
        });
    }

    async findByLecturer(lecturerId: number): Promise<IAllocation[]> {
        const results = await (this.prisma as any).allocation.findMany({
            where: { lecturerId },
            include: { course: true }
        });
        return results.map((r: PrismaAllocation) => this.mapToEntity(r));
    }

    async findByCourse(courseId: number): Promise<IAllocation[]> {
        const results = await (this.prisma as any).allocation.findMany({
            where: { courseId },
            include: { lecturer: true }
        });
        return results.map((r: PrismaAllocation) => this.mapToEntity(r));
    }

    async findByStatus(status: AllocationStatus): Promise<IAllocation[]> {
        const results = await (this.prisma as any).allocation.findMany({
            where: { status },
            include: { lecturer: true, course: true }
        });
        return results.map((r: PrismaAllocation) => this.mapToEntity(r));
    }

    async findActiveAllocations(): Promise<IAllocation[]> {
        const results = await (this.prisma as any).allocation.findMany({
            where: {
                status: { in: ['AUTO_ALLOCATED', 'APPROVED', 'OVERRIDDEN'] }
            },
            include: { lecturer: true, course: true }
        });
        return results.map((r: PrismaAllocation) => this.mapToEntity(r));
    }

    async findBySession(_sessionId: string): Promise<IAllocation[]> {
        const results = await (this.prisma as any).allocation.findMany({
            where: {
                status: { in: ['AUTO_ALLOCATED', 'APPROVED', 'OVERRIDDEN'] }
            },
            include: { lecturer: true, course: true }
        });
        return results.map((r: PrismaAllocation) => this.mapToEntity(r));
    }

    async deleteByCourse(courseId: number): Promise<void> {
        await (this.prisma as any).allocation.deleteMany({
            where: { courseId }
        });
    }

    async deleteByLecturer(lecturerId: number): Promise<void> {
        await (this.prisma as any).allocation.deleteMany({
            where: { lecturerId }
        });
    }

    async findPendingAllocations(): Promise<IAllocation[]> {
        const results = await (this.prisma as any).allocation.findMany({
            where: { status: 'PENDING' },
            include: { lecturer: true, course: true }
        });
        return results.map((r: PrismaAllocation) => this.mapToEntity(r));
    }

    private mapToEntity(prismaData: PrismaAllocation): IAllocation {
        return new Allocation(
            prismaData.id,
            prismaData.lecturerId,
            prismaData.courseId,
            prismaData.assignedBy,
            prismaData.status as AllocationStatus,
            prismaData.score || undefined,
            prismaData.overrideReason || undefined,
            prismaData.assignedAt,
            prismaData.createdAt,
            prismaData.updatedAt
        );
    }
}