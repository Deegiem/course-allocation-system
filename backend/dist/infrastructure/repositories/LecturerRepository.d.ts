import { PrismaClient } from '@prisma/client';
import { ILecturerRepository } from '../../domain/interfaces/IRepository';
import { ILecturer } from '../../domain/entities';
import { BaseRepository } from './BaseRepository';
export declare class LecturerRepository extends BaseRepository<ILecturer> implements ILecturerRepository {
    constructor(prisma: PrismaClient);
    create(data: Partial<ILecturer>): Promise<ILecturer>;
    update(id: number, data: Partial<ILecturer>): Promise<ILecturer>;
    findByStaffId(staffId: string): Promise<ILecturer | null>;
    findByEmail(email: string): Promise<ILecturer | null>;
    findBySpecialization(specialization: string): Promise<ILecturer[]>;
    findActive(): Promise<ILecturer[]>;
    getWorkload(lecturerId: number): Promise<number>;
    getCurrentAllocations(lecturerId: number): Promise<any[]>;
    private mapToEntity;
}
