import { Request, Response } from 'express';
import { LecturerService } from '../../application/services/LecturerService';
export declare class LecturerController {
    private lecturerService;
    constructor(lecturerService: LecturerService);
    getAll(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getActive(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getByStaffId(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getWorkload(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getAllocations(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    create(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    update(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    delete(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
