"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportRepository = void 0;
const entities_1 = require("../../domain/entities");
const BaseRepository_1 = require("./BaseRepository");
class ReportRepository extends BaseRepository_1.BaseRepository {
    constructor(prisma) {
        super(prisma, 'report');
    }
    async create(data) {
        const result = await this.prisma.report.create({
            data: {
                generatedBy: data.generatedBy,
                reportType: data.reportType,
                data: data.data,
                filePath: data.filePath
            }
        });
        return this.mapToEntity(result);
    }
    async update(id, data) {
        const result = await this.prisma.report.update({
            where: { id },
            data: {
                generatedBy: data.generatedBy,
                reportType: data.reportType,
                data: data.data,
                filePath: data.filePath
            }
        });
        return this.mapToEntity(result);
    }
    async findByType(reportType) {
        const results = await this.prisma.report.findMany({
            where: { reportType }
        });
        return results.map(r => this.mapToEntity(r));
    }
    async findByDateRange(start, end) {
        const results = await this.prisma.report.findMany({
            where: {
                generatedAt: {
                    gte: start,
                    lte: end
                }
            }
        });
        return results.map(r => this.mapToEntity(r));
    }
    async findByGenerator(generatedBy) {
        const results = await this.prisma.report.findMany({
            where: { generatedBy }
        });
        return results.map(r => this.mapToEntity(r));
    }
    mapToEntity(data) {
        return new entities_1.Report(data.id, data.generatedBy, data.reportType, data.data, data.generatedAt, data.filePath);
    }
}
exports.ReportRepository = ReportRepository;
//# sourceMappingURL=ReportRepository.js.map