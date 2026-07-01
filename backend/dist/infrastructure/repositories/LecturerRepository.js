"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LecturerRepository = void 0;
const entities_1 = require("../../domain/entities");
const BaseRepository_1 = require("./BaseRepository");
class LecturerRepository extends BaseRepository_1.BaseRepository {
    constructor(prisma) {
        super(prisma, 'lecturer');
    }
    async create(data) {
        // Convert array to comma-separated string for SQLite/PostgreSQL
        let specialization = '';
        if (Array.isArray(data.specialization)) {
            specialization = data.specialization.join(',');
        }
        else if (typeof data.specialization === 'string') {
            specialization = data.specialization;
        }
        const result = await this.prisma.lecturer.create({
            data: {
                staffId: data.staffId,
                name: data.name,
                email: data.email,
                rank: data.rank,
                specialization: specialization,
                teachingStyle: data.teachingStyle,
                yearsOfExperience: data.yearsOfExperience,
                maxHours: data.maxHours || 18,
                isActive: data.isActive !== undefined ? data.isActive : true
            }
        });
        return this.mapToEntity(result);
    }
    async update(id, data) {
        // Convert array to comma-separated string if provided
        let specialization = undefined;
        if (Array.isArray(data.specialization)) {
            specialization = data.specialization.join(',');
        }
        else if (typeof data.specialization === 'string') {
            specialization = data.specialization;
        }
        const result = await this.prisma.lecturer.update({
            where: { id },
            data: {
                staffId: data.staffId,
                name: data.name,
                email: data.email,
                rank: data.rank,
                specialization: specialization,
                teachingStyle: data.teachingStyle,
                yearsOfExperience: data.yearsOfExperience,
                maxHours: data.maxHours,
                isActive: data.isActive
            }
        });
        return this.mapToEntity(result);
    }
    async findByStaffId(staffId) {
        const result = await this.prisma.lecturer.findUnique({
            where: { staffId }
        });
        return result ? this.mapToEntity(result) : null;
    }
    async findByEmail(email) {
        const result = await this.prisma.lecturer.findUnique({
            where: { email }
        });
        return result ? this.mapToEntity(result) : null;
    }
    async findBySpecialization(specialization) {
        const results = await this.prisma.lecturer.findMany({
            where: {
                specialization: {
                    contains: specialization
                }
            }
        });
        return results.map(r => this.mapToEntity(r));
    }
    async findActive() {
        const results = await this.prisma.lecturer.findMany({
            where: { isActive: true }
        });
        return results.map(r => this.mapToEntity(r));
    }
    async getWorkload(lecturerId) {
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
    async getCurrentAllocations(lecturerId) {
        return await this.prisma.allocation.findMany({
            where: {
                lecturerId,
                status: { in: ['AUTO_ALLOCATED', 'APPROVED', 'OVERRIDDEN'] }
            },
            include: { course: true }
        });
    }
    mapToEntity(prismaData) {
        // Convert comma-separated string back to array
        const specialization = prismaData.specialization
            ? prismaData.specialization.split(',').filter(s => s.trim())
            : [];
        return new entities_1.Lecturer(prismaData.id, prismaData.staffId, prismaData.name, prismaData.email, prismaData.rank, specialization, prismaData.teachingStyle, prismaData.yearsOfExperience, prismaData.maxHours, prismaData.isActive, prismaData.createdAt, prismaData.updatedAt);
    }
}
exports.LecturerRepository = LecturerRepository;
//# sourceMappingURL=LecturerRepository.js.map