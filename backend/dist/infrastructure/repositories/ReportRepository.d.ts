import { PrismaClient } from '@prisma/client';
import { IReportRepository } from '../../domain/interfaces/IRepository';
import { IReport } from '../../domain/entities';
import { BaseRepository } from './BaseRepository';
export declare class ReportRepository extends BaseRepository<IReport> implements IReportRepository {
    constructor(prisma: PrismaClient);
    create(data: Partial<IReport>): Promise<IReport>;
    update(id: number, data: Partial<IReport>): Promise<IReport>;
    findByType(reportType: string): Promise<IReport[]>;
    findByDateRange(start: Date, end: Date): Promise<IReport[]>;
    findByGenerator(generatedBy: string): Promise<IReport[]>;
    private mapToEntity;
}
