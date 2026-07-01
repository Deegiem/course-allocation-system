import { Request, Response } from 'express';
export declare class ReportController {
    generateAllocationReport(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    generateWorkloadSummary(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    generateLevelBasedList(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getAll(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    exportToPDF(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    private generateAllocationPDF;
    private generateWorkloadPDF;
    private generateLevelPDF;
}
