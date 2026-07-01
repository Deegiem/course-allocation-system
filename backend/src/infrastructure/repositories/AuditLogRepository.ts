import { PrismaClient } from '@prisma/client';
import { IAuditLogRepository } from '../../domain/interfaces/IRepository';
import { AuditLog, IAuditLog } from '../../domain/entities';
import { BaseRepository } from './BaseRepository';

export class AuditLogRepository extends BaseRepository<IAuditLog> implements IAuditLogRepository {
  constructor(prisma: PrismaClient) {
    super(prisma, 'auditLog');
  }

  async create(data: Partial<IAuditLog>): Promise<IAuditLog> {
    // Convert payload to JSON string if it's an object
    let payload = data.payload;
    if (payload && typeof payload === 'object') {
      payload = JSON.stringify(payload);
    }

    const result = await this.prisma.auditLog.create({
      data: {
        actionType: data.actionType!,
        entity: data.entity!,
        entityId: data.entityId!,
        payload: payload as string | null | undefined,
        lecturerId: data.lecturerId,
        courseId: data.courseId,
        allocationId: data.allocationId
      }
    });
    return this.mapToEntity(result);
  }

  async update(id: number, data: Partial<IAuditLog>): Promise<IAuditLog> {
    // Convert payload to JSON string if it's an object
    let payload = data.payload;
    if (payload && typeof payload === 'object') {
      payload = JSON.stringify(payload);
    }

    const result = await this.prisma.auditLog.update({
      where: { id },
      data: {
        actionType: data.actionType,
        entity: data.entity,
        entityId: data.entityId,
        payload: payload as string | null | undefined,
        lecturerId: data.lecturerId,
        courseId: data.courseId,
        allocationId: data.allocationId
      }
    });
    return this.mapToEntity(result);
  }

  async findByEntity(entity: string, entityId: number): Promise<IAuditLog[]> {
    const results = await this.prisma.auditLog.findMany({
      where: { entity, entityId }
    });
    return results.map(r => this.mapToEntity(r));
  }

  async findByDateRange(start: Date, end: Date): Promise<IAuditLog[]> {
    const results = await this.prisma.auditLog.findMany({
      where: {
        timestamp: {
          gte: start,
          lte: end
        }
      }
    });
    return results.map(r => this.mapToEntity(r));
  }

  async findByActionType(actionType: string): Promise<IAuditLog[]> {
    const results = await this.prisma.auditLog.findMany({
      where: { actionType }
    });
    return results.map(r => this.mapToEntity(r));
  }

  async findByLecturer(lecturerId: number): Promise<IAuditLog[]> {
    const results = await this.prisma.auditLog.findMany({
      where: { lecturerId }
    });
    return results.map(r => this.mapToEntity(r));
  }

  async findByCourse(courseId: number): Promise<IAuditLog[]> {
    const results = await this.prisma.auditLog.findMany({
      where: { courseId }
    });
    return results.map(r => this.mapToEntity(r));
  }

  async findByAllocation(allocationId: number): Promise<IAuditLog[]> {
    const results = await this.prisma.auditLog.findMany({
      where: { allocationId }
    });
    return results.map(r => this.mapToEntity(r));
  }

  private mapToEntity(data: any): IAuditLog {
    // Parse payload if it's a JSON string
    let payload = data.payload;
    if (payload && typeof payload === 'string') {
      try {
        payload = JSON.parse(payload);
      } catch {
        // Keep as string if not valid JSON
      }
    }

    return new AuditLog(
      data.id,
      data.actionType,
      data.entity,
      data.entityId,
      data.timestamp,
      payload,
      data.lecturerId,
      data.courseId,
      data.allocationId
    );
  }
}