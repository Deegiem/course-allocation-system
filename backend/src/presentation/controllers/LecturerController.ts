import { Request, Response } from 'express';
import { LecturerService } from '../../application/services/LecturerService';

export class LecturerController {
    constructor(private lecturerService: LecturerService) { }

    async getAll(_req: Request, res: Response) {
        try {
            const lecturers = await this.lecturerService.getAllLecturers();
            return res.json({ success: true, data: lecturers });
        } catch (error) {
            return res.status(500).json({ success: false, error: (error as Error).message });
        }
    }

    async getActive(_req: Request, res: Response) {
        try {
            const lecturers = await this.lecturerService.getActiveLecturers();
            return res.json({ success: true, data: lecturers });
        } catch (error) {
            return res.status(500).json({ success: false, error: (error as Error).message });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const lecturer = await this.lecturerService.getLecturer(id);
            if (!lecturer) {
                return res.status(404).json({ success: false, error: 'Lecturer not found' });
            }
            return res.json({ success: true, data: lecturer });
        } catch (error) {
            return res.status(500).json({ success: false, error: (error as Error).message });
        }
    }

    async getByStaffId(req: Request, res: Response) {
        try {
            const lecturer = await this.lecturerService.getLecturerByStaffId(req.params.staffId);
            if (!lecturer) {
                return res.status(404).json({ success: false, error: 'Lecturer not found' });
            }
            return res.json({ success: true, data: lecturer });
        } catch (error) {
            return res.status(500).json({ success: false, error: (error as Error).message });
        }
    }

    async getWorkload(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const workload = await this.lecturerService.getLecturerWorkload(id);
            return res.json({ success: true, data: workload });
        } catch (error) {
            return res.status(500).json({ success: false, error: (error as Error).message });
        }
    }

    async getAllocations(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const allocations = await this.lecturerService.getLecturerAllocations(id);
            return res.json({ success: true, data: allocations });
        } catch (error) {
            return res.status(500).json({ success: false, error: (error as Error).message });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const lecturer = await this.lecturerService.createLecturer(req.body);
            return res.status(201).json({ success: true, data: lecturer });
        } catch (error) {
            return res.status(400).json({ success: false, error: (error as Error).message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const lecturer = await this.lecturerService.updateLecturer(id, req.body);
            return res.json({ success: true, data: lecturer });
        } catch (error) {
            return res.status(400).json({ success: false, error: (error as Error).message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await this.lecturerService.deleteLecturer(id);
            return res.json({ success: true, message: 'Lecturer deleted successfully' });
        } catch (error) {
            return res.status(400).json({ success: false, error: (error as Error).message });
        }
    }
}