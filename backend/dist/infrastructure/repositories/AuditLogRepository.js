"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogRepository = void 0;
const entities_1 = require("../../domain/entities");
const BaseRepository_1 = require("./BaseRepository");
class AuditLogRepository extends BaseRepository_1.BaseRepository {
    constructor(prisma) {
        super(prisma, 'auditLog');
    }
    async create(data) {
        // Convert payload to JSON string if it's an object
        let payload = data.payload;
        if (payload && typeof payload === 'object') {
            payload = JSON.stringify(payload);
        }
        const result = await this.prisma.auditLog.create({
            data: {
                actionType: data.actionType,
                entity: data.entity,
                entityId: data.entityId,
                payload: payload,
                lecturerId: data.lecturerId,
                courseId: data.courseId,
                allocationId: data.allocationId
            }
        });
        return this.mapToEntity(result);
    }
    async update(id, data) {
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
                payload: payload,
                lecturerId: data.lecturerId,
                courseId: data.courseId,
                allocationId: data.allocationId
            }
        });
        return this.mapToEntity(result);
    }
    async findByEntity(entity, entityId) {
        const results = await this.prisma.auditLog.findMany({
            where: { entity, entityId }
        });
        return results.map(r => this.mapToEntity(r));
    }
    async findByDateRange(start, end) {
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
    async findByActionType(actionType) {
        const results = await this.prisma.auditLog.findMany({
            where: { actionType }
        });
        return results.map(r => this.mapToEntity(r));
    }
    async findByLecturer(lecturerId) {
        const results = await this.prisma.auditLog.findMany({
            where: { lecturerId }
        });
        return results.map(r => this.mapToEntity(r));
    }
    async findByCourse(courseId) {
        const results = await this.prisma.auditLog.findMany({
            where: { courseId }
        });
        return results.map(r => this.mapToEntity(r));
    }
    async findByAllocation(allocationId) {
        const results = await this.prisma.auditLog.findMany({
            where: { allocationId }
        });
        return results.map(r => this.mapToEntity(r));
    }
    mapToEntity(data) {
        // Parse payload if it's a JSON string
        let payload = data.payload;
        if (payload && typeof payload === 'string') {
            try {
                payload = JSON.parse(payload);
            }
            catch {
                // Keep as string if not valid JSON
            }
        }
        return new entities_1.AuditLog(data.id, data.actionType, data.entity, data.entityId, data.timestamp, payload, data.lecturerId, data.courseId, data.allocationId);
    }
}
exports.AuditLogRepository = AuditLogRepository;
//# sourceMappingURL=AuditLogRepository.js.map