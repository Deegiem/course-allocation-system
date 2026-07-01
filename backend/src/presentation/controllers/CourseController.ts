import { Request, Response } from 'express';
import { CourseService } from '../../application/services/CourseService';

export class CourseController {
    constructor(private courseService: CourseService) { }

    async getAll(_req: Request, res: Response) {
        try {
            const courses = await this.courseService.getAllCourses();
            return res.json({ success: true, data: courses });
        } catch (error) {
            return res.status(500).json({ success: false, error: (error as Error).message });
        }
    }

    async getActive(_req: Request, res: Response) {
        try {
            const courses = await this.courseService.getActiveCourses();
            return res.json({ success: true, data: courses });
        } catch (error) {
            return res.status(500).json({ success: false, error: (error as Error).message });
        }
    }

    async getByLevel(req: Request, res: Response) {
        try {
            const level = parseInt(req.params.level);
            const courses = await this.courseService.getCoursesByLevel(level);
            return res.json({ success: true, data: courses });
        } catch (error) {
            return res.status(500).json({ success: false, error: (error as Error).message });
        }
    }

    async getUnallocated(_req: Request, res: Response) {
        try {
            const courses = await this.courseService.getUnallocatedCourses();
            return res.json({ success: true, data: courses });
        } catch (error) {
            return res.status(500).json({ success: false, error: (error as Error).message });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const course = await this.courseService.getCourse(id);
            if (!course) {
                return res.status(404).json({ success: false, error: 'Course not found' });
            }
            return res.json({ success: true, data: course });
        } catch (error) {
            return res.status(500).json({ success: false, error: (error as Error).message });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const course = await this.courseService.createCourse(req.body);
            return res.status(201).json({ success: true, data: course });
        } catch (error) {
            return res.status(400).json({ success: false, error: (error as Error).message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const course = await this.courseService.updateCourse(id, req.body);
            return res.json({ success: true, data: course });
        } catch (error) {
            return res.status(400).json({ success: false, error: (error as Error).message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);

            // Check if course exists
            const course = await this.courseService.getCourse(id);
            if (!course) {
                return res.status(404).json({ success: false, error: 'Course not found' });
            }

            // Check if course has active allocations
            const allocations = await this.courseService.getCourseAllocations(id);
            const activeAllocations = allocations.filter(a =>
                a.status === 'AUTO_ALLOCATED' || a.status === 'APPROVED' || a.status === 'OVERRIDDEN'
            );

            if (activeAllocations.length > 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Cannot delete course with active allocations. Please remove allocations first.'
                });
            }

            await this.courseService.deleteCourse(id);
            return res.json({ success: true, message: 'Course deleted successfully' });
        } catch (error) {
            return res.status(400).json({ success: false, error: (error as Error).message });
        }
    }
}