import { PrismaClient } from '@prisma/client';
import { IAuditLogRepository } from '../../domain/interfaces/IRepository';
import { IAuditLog } from '../../domain/entities';
import { BaseRepository } from './BaseRepository';
export declare class AuditLogRepository extends BaseRepository<IAuditLog> implements IAuditLogRepository {
    constructor(prisma: PrismaClient);
    create(data: Partial<IAuditLog>): Promise<IAuditLog>;
    update(id: number, data: Partial<IAuditLog>): Promise<IAuditLog>;
    findByEntity(entity: string, entityId: number): Promise<IAuditLog[]>;
    findByDateRange(start: Date, end: Date): Promise<IAuditLog[]>;
    findByActionType(actionType: string): Promise<IAuditLog[]>;
    findByLecturer(lecturerId: number): Promise<IAuditLog[]>;
    findByCourse(courseId: number): Promise<IAuditLog[]>;
    findByAllocation(allocationId: number): Promise<IAuditLog[]>;
    private mapToEntity;
}
