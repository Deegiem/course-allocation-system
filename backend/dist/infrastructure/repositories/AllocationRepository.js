"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllocationRepository = void 0;
const entities_1 = require("../../domain/entities");
const BaseRepository_1 = require("./BaseRepository");
class AllocationRepository extends BaseRepository_1.BaseRepository {
    constructor(prisma) {
        super(prisma, 'allocation');
    }
    async create(data) {
        const result = await this.prisma.allocation.create({
            data: {
                lecturerId: data.lecturerId,
                courseId: data.courseId,
                score: data.score,
                status: data.status || 'PENDING',
                overrideReason: data.overrideReason,
                assignedBy: data.assignedBy,
                assignedAt: data.assignedAt || new Date()
            },
            include: { lecturer: true, course: true }
        });
        return this.mapToEntity(result);
    }
    async update(id, data) {
        const result = await this.prisma.allocation.update({
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
    async delete(id) {
        await this.prisma.allocation.delete({
            where: { id }
        });
    }
    async findByLecturer(lecturerId) {
        const results = await this.prisma.allocation.findMany({
            where: { lecturerId },
            include: { course: true }
        });
        return results.map((r) => this.mapToEntity(r));
    }
    async findByCourse(courseId) {
        const results = await this.prisma.allocation.findMany({
            where: { courseId },
            include: { lecturer: true }
        });
        return results.map((r) => this.mapToEntity(r));
    }
    async findByStatus(status) {
        const results = await this.prisma.allocation.findMany({
            where: { status },
            include: { lecturer: true, course: true }
        });
        return results.map((r) => this.mapToEntity(r));
    }
    async findActiveAllocations() {
        const results = await this.prisma.allocation.findMany({
            where: {
                status: { in: ['AUTO_ALLOCATED', 'APPROVED', 'OVERRIDDEN'] }
            },
            include: { lecturer: true, course: true }
        });
        return results.map((r) => this.mapToEntity(r));
    }
    async findBySession(_sessionId) {
        const results = await this.prisma.allocation.findMany({
            where: {
                status: { in: ['AUTO_ALLOCATED', 'APPROVED', 'OVERRIDDEN'] }
            },
            include: { lecturer: true, course: true }
        });
        return results.map((r) => this.mapToEntity(r));
    }
    async deleteByCourse(courseId) {
        await this.prisma.allocation.deleteMany({
            where: { courseId }
        });
    }
    async deleteByLecturer(lecturerId) {
        await this.prisma.allocation.deleteMany({
            where: { lecturerId }
        });
    }
    async findPendingAllocations() {
        const results = await this.prisma.allocation.findMany({
            where: { status: 'PENDING' },
            include: { lecturer: true, course: true }
        });
        return results.map((r) => this.mapToEntity(r));
    }
    mapToEntity(prismaData) {
        return new entities_1.Allocation(prismaData.id, prismaData.lecturerId, prismaData.courseId, prismaData.assignedBy, prismaData.status, prismaData.score || undefined, prismaData.overrideReason || undefined, prismaData.assignedAt, prismaData.createdAt, prismaData.updatedAt);
    }
}
exports.AllocationRepository = AllocationRepository;
//# sourceMappingURL=AllocationRepository.js.map