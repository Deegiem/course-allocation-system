import { Request, Response } from 'express';
import { CourseService } from '../../application/services/CourseService';
export declare class CourseController {
    private courseService;
    constructor(courseService: CourseService);
    getAll(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getActive(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getByLevel(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getUnallocated(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    create(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    update(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    delete(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
