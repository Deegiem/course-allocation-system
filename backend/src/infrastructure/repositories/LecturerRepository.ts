import { PrismaClient, Lecturer as PrismaLecturer } from '@prisma/client';
import { ILecturerRepository } from '../../domain/interfaces/IRepository';
import { Lecturer, ILecturer } from '../../domain/entities';
import { BaseRepository } from './BaseRepository';

export class LecturerRepository extends BaseRepository<ILecturer> implements ILecturerRepository {
    constructor(prisma: PrismaClient) {
        super(prisma, 'lecturer');
    }

    async create(data: Partial<ILecturer>): Promise<ILecturer> {
        // Convert array to comma-separated string for SQLite/PostgreSQL
        let specialization = '';
        if (Array.isArray(data.specialization)) {
            specialization = data.specialization.join(',');
        } else if (typeof data.specialization === 'string') {
            specialization = data.specialization;
        }

        const result = await this.prisma.lecturer.create({
            data: {
                staffId: data.staffId!,
                name: data.name!,
                email: data.email!,
                rank: data.rank! as any,
                specialization: specialization,
                teachingStyle: data.teachingStyle! as any,
                yearsOfExperience: data.yearsOfExperience!,
                maxHours: data.maxHours || 18,
                isActive: data.isActive !== undefined ? data.isActive : true
            }
        });
        return this.mapToEntity(result);
    }

    async update(id: number, data: Partial<ILecturer>): Promise<ILecturer> {
        // Convert array to comma-separated string if provided
        let specialization: string | undefined = undefined;
        if (Array.isArray(data.specialization)) {
            specialization = data.specialization.join(',');
        } else if (typeof data.specialization === 'string') {
            specialization = data.specialization;
        }

        const result = await this.prisma.lecturer.update({
            where: { id },
            data: {
                staffId: data.staffId,
                name: data.name,
                email: data.email,
                rank: data.rank as any,
                specialization: specialization,
                teachingStyle: data.teachingStyle as any,
                yearsOfExperience: data.yearsOfExperience,
                maxHours: data.maxHours,
                isActive: data.isActive
            }
        });
        return this.mapToEntity(result);
    }

    async findByStaffId(staffId: string): Promise<ILecturer | null> {
        const result = await this.prisma.lecturer.findUnique({
            where: { staffId }
        });
        return result ? this.mapToEntity(result) : null;
    }

    async findByEmail(email: string): Promise<ILecturer | null> {
        const result = await this.prisma.lecturer.findUnique({
            where: { email }
        });
        return result ? this.mapToEntity(result) : null;
    }

    async findBySpecialization(specialization: string): Promise<ILecturer[]> {
        const results = await this.prisma.lecturer.findMany({
            where: {
                specialization: {
                    contains: specialization
                }
            }
        });
        return results.map(r => this.mapToEntity(r));
    }

    async findActive(): Promise<ILecturer[]> {
        const results = await this.prisma.lecturer.findMany({
            where: { isActive: true }
        });
        return results.map(r => this.mapToEntity(r));
    }

    async getWorkload(lecturerId: number): Promise<number> {
        const allocations = await this.prisma.allocation.findMany({
            where: {
                lecturerId,
                status: { in: ['AUTO_ALLOCATED', 'APPROVED', 'OVERRIDDEN'] }
            },
            include: { course: true }
        });

        // Calculate total units from active allocations
        const total = allocations.reduce((sum, alloc) => sum + alloc.course.units, 0);
        console.log(`Lecturer ${lecturerId} workload: ${total} hours from ${allocations.length} allocations`);
        return total;
    }

    async getCurrentAllocations(lecturerId: number): Promise<any[]> {
        return await this.prisma.allocation.findMany({
            where: {
                lecturerId,
                status: { in: ['AUTO_ALLOCATED', 'APPROVED', 'OVERRIDDEN'] }
            },
            include: { course: true }
        });
    }

    private mapToEntity(prismaData: PrismaLecturer): ILecturer {
        // Convert comma-separated string back to array
        const specialization = prismaData.specialization
            ? prismaData.specialization.split(',').filter(s => s.trim())
            : [];

        return new Lecturer(
            prismaData.id,
            prismaData.staffId,
            prismaData.name,
            prismaData.email,
            prismaData.rank as any,
            specialization,
            prismaData.teachingStyle as any,
            prismaData.yearsOfExperience,
            prismaData.maxHours,
            prismaData.isActive,
            prismaData.createdAt,
            prismaData.updatedAt
        );
    }
}