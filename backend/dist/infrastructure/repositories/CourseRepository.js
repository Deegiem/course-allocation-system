"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseRepository = void 0;
const entities_1 = require("../../domain/entities");
const BaseRepository_1 = require("./BaseRepository");
class CourseRepository extends BaseRepository_1.BaseRepository {
    constructor(prisma) {
        super(prisma, 'course');
    }
    async create(data) {
        const result = await this.prisma.course.create({
            data: {
                code: data.code,
                title: data.title,
                units: data.units,
                level: data.level,
                nature: data.nature,
                lectureHours: data.lectureHours,
                practicalHours: data.practicalHours,
                status: data.status !== undefined ? data.status : true
            }
        });
        return this.mapToEntity(result);
    }
    async update(id, data) {
        const result = await this.prisma.course.update({
            where: { id },
            data: {
                code: data.code,
                title: data.title,
                units: data.units,
                level: data.level,
                nature: data.nature,
                lectureHours: data.lectureHours,
                practicalHours: data.practicalHours,
                status: data.status
            }
        });
        return this.mapToEntity(result);
    }
    async findByCode(code) {
        const result = await this.prisma.course.findUnique({
            where: { code }
        });
        return result ? this.mapToEntity(result) : null;
    }
    async findByLevel(level) {
        const results = await this.prisma.course.findMany({
            where: { level }
        });
        return results.map(r => this.mapToEntity(r));
    }
    async findActive() {
        const results = await this.prisma.course.findMany({
            where: { status: true }
        });
        return results.map(r => this.mapToEntity(r));
    }
    async getUnallocatedCourses() {
        const results = await this.prisma.course.findMany({
            where: {
                status: true,
                allocations: {
                    none: {
                        status: { in: ['AUTO_ALLOCATED', 'APPROVED', 'OVERRIDDEN'] }
                    }
                }
            }
        });
        return results.map(r => this.mapToEntity(r));
    }
    mapToEntity(prismaData) {
        return new entities_1.Course(prismaData.id, prismaData.code, prismaData.title, prismaData.units, prismaData.level, prismaData.nature, prismaData.lectureHours, prismaData.practicalHours, prismaData.status, prismaData.createdAt, prismaData.updatedAt);
    }
}
exports.CourseRepository = CourseRepository;
//# sourceMappingURL=CourseRepository.js.map