import { ReportType } from '../enums';
export interface IReport {
    id: number;
    generatedBy: string;
    generatedAt: Date;
    reportType: ReportType;
    data: any;
    filePath?: string;
}
export declare class Report implements IReport {
    id: number;
    generatedBy: string;
    reportType: ReportType;
    data: any;
    generatedAt: Date;
    filePath?: string | undefined;
    constructor(id: number, generatedBy: string, reportType: ReportType, data: any, generatedAt?: Date, filePath?: string | undefined);
    hasFile(): boolean;
    getSummary(): string;
}
