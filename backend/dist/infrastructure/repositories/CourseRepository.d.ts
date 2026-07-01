import { PrismaClient } from '@prisma/client';
import { ICourseRepository } from '../../domain/interfaces/IRepository';
import { ICourse } from '../../domain/entities';
import { BaseRepository } from './BaseRepository';
export declare class CourseRepository extends BaseRepository<ICourse> implements ICourseRepository {
    constructor(prisma: PrismaClient);
    create(data: Partial<ICourse>): Promise<ICourse>;
    update(id: number, data: Partial<ICourse>): Promise<ICourse>;
    findByCode(code: string): Promise<ICourse | null>;
    findByLevel(level: number): Promise<ICourse[]>;
    findActive(): Promise<ICourse[]>;
    getUnallocatedCourses(): Promise<ICourse[]>;
    private mapToEntity;
}
