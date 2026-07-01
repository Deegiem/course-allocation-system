import { Request, Response } from 'express';
import { AllocationService } from '../../application/services/AllocationService';
export declare class AllocationController {
    private allocationService;
    constructor(allocationService: AllocationService);
    getAll(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getPending(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getByLecturer(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getByCourse(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getWorkloadDistribution(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    manualAllocate(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    autoAllocate(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    validateAllocation(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    approve(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    reject(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    override(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    delete(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
