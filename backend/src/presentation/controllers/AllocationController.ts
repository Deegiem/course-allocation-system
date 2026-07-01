import { Request, Response } from 'express';
import { AllocationService } from '../../application/services/AllocationService';
import { OverrideAction } from '../../domain/enums';

export class AllocationController {
    constructor(private allocationService: AllocationService) { }

    async getAll(req: Request, res: Response) {
        try {
            const { lecturerId, courseId, status } = req.query;

            let allocations;
            if (lecturerId) {
                allocations = await this.allocationService.getLecturerAllocations(parseInt(lecturerId as string));
            } else if (courseId) {
                allocations = await this.allocationService.getCourseAllocations(parseInt(courseId as string));
            } else if (status === 'pending') {
                allocations = await this.allocationService.getPendingAllocations();
            } else {
                allocations = await this.allocationService.getAllocations();
            }

            return res.json({ success: true, data: allocations });
        } catch (error) {
            return res.status(500).json({ success: false, error: (error as Error).message });
        }
    }

    async getPending(_req: Request, res: Response) {
        try {
            const allocations = await this.allocationService.getPendingAllocations();
            return res.json({ success: true, data: allocations });
        } catch (error) {
            return res.status(500).json({ success: false, error: (error as Error).message });
        }
    }

    async getByLecturer(req: Request, res: Response) {
        try {
            const lecturerId = parseInt(req.params.lecturerId);
            const allocations = await this.allocationService.getLecturerAllocations(lecturerId);
            return res.json({ success: true, data: allocations });
        } catch (error) {
            return res.status(500).json({ success: false, error: (error as Error).message });
        }
    }

    async getByCourse(req: Request, res: Response) {
        try {
            const courseId = parseInt(req.params.courseId);
            const allocations = await this.allocationService.getCourseAllocations(courseId);
            return res.json({ success: true, data: allocations });
        } catch (error) {
            return res.status(500).json({ success: false, error: (error as Error).message });
        }
    }

    async getWorkloadDistribution(_req: Request, res: Response) {
        try {
            const distribution = await this.allocationService.getWorkloadDistribution();
            return res.json({ success: true, data: distribution });
        } catch (error) {
            return res.status(500).json({ success: false, error: (error as Error).message });
        }
    }

    async manualAllocate(req: Request, res: Response) {
        try {
            const { lecturerId, courseId, assignedBy } = req.body;
            const allocation = await this.allocationService.allocateManually(
                lecturerId,
                courseId,
                assignedBy
            );
            return res.status(201).json({ success: true, data: allocation });
        } catch (error) {
            return res.status(400).json({ success: false, error: (error as Error).message });
        }
    }

    async autoAllocate(req: Request, res: Response) {
        try {
            const { assignedBy } = req.body;
            const allocations = await this.allocationService.allocateAutomatically(
                `session_${Date.now()}`,
                assignedBy
            );
            return res.status(201).json({ success: true, data: allocations });
        } catch (error) {
            return res.status(400).json({ success: false, error: (error as Error).message });
        }
    }

    async validateAllocation(req: Request, res: Response) {
        try {
            const { lecturerId, courseId } = req.body;
            const validation = await this.allocationService.validateAllocation(lecturerId, courseId);
            return res.json({ success: true, data: validation });
        } catch (error) {
            return res.status(400).json({ success: false, error: (error as Error).message });
        }
    }

    async approve(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const { approvedBy } = req.body;
            const allocation = await this.allocationService.approveAllocation(id, approvedBy);
            return res.json({ success: true, data: allocation });
        } catch (error) {
            return res.status(400).json({ success: false, error: (error as Error).message });
        }
    }

    async reject(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const { reason, rejectedBy } = req.body;
            const allocation = await this.allocationService.rejectAllocation(id, reason, rejectedBy);
            return res.json({ success: true, data: allocation });
        } catch (error) {
            return res.status(400).json({ success: false, error: (error as Error).message });
        }
    }

    async override(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const { action, reason, actedBy, newLecturerId } = req.body;

            const allocation = await this.allocationService.overrideAllocation(
                id,
                action as OverrideAction,
                reason,
                actedBy,
                newLecturerId // Pass the new lecturer ID
            );
            return res.json({ success: true, data: allocation });
        } catch (error) {
            return res.status(400).json({ success: false, error: (error as Error).message });
        }
    }

    async delete(_req: Request, res: Response) {
        try {
            return res.json({ success: true, message: 'Allocation deleted successfully' });
        } catch (error) {
            return res.status(400).json({ success: false, error: (error as Error).message });
        }
    }
}