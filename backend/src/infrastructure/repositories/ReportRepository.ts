import { PrismaClient } from '@prisma/client';
import { IReportRepository } from '../../domain/interfaces/IRepository';
import { Report, IReport } from '../../domain/entities';
import { BaseRepository } from './BaseRepository';

export class ReportRepository extends BaseRepository<IReport> implements IReportRepository {
  constructor(prisma: PrismaClient) {
    super(prisma, 'report');
  }

  async create(data: Partial<IReport>): Promise<IReport> {
    const result = await this.prisma.report.create({
      data: {
        generatedBy: data.generatedBy!,
        reportType: data.reportType!,
        data: data.data!,
        filePath: data.filePath
      }
    });
    return this.mapToEntity(result);
  }

  async update(id: number, data: Partial<IReport>): Promise<IReport> {
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

  async findByType(reportType: string): Promise<IReport[]> {
    const results = await this.prisma.report.findMany({
      where: { reportType }
    });
    return results.map(r => this.mapToEntity(r));
  }

  async findByDateRange(start: Date, end: Date): Promise<IReport[]> {
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

  async findByGenerator(generatedBy: string): Promise<IReport[]> {
    const results = await this.prisma.report.findMany({
      where: { generatedBy }
    });
    return results.map(r => this.mapToEntity(r));
  }

  private mapToEntity(data: any): IReport {
    return new Report(
      data.id,
      data.generatedBy,
      data.reportType,
      data.data,
      data.generatedAt,
      data.filePath
    );
  }
}