"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllocationController = void 0;
class AllocationController {
    constructor(allocationService) {
        this.allocationService = allocationService;
    }
    async getAll(req, res) {
        try {
            const { lecturerId, courseId, status } = req.query;
            let allocations;
            if (lecturerId) {
                allocations = await this.allocationService.getLecturerAllocations(parseInt(lecturerId));
            }
            else if (courseId) {
                allocations = await this.allocationService.getCourseAllocations(parseInt(courseId));
            }
            else if (status === 'pending') {
                allocations = await this.allocationService.getPendingAllocations();
            }
            else {
                allocations = await this.allocationService.getAllocations();
            }
            return res.json({ success: true, data: allocations });
        }
        catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
    async getPending(_req, res) {
        try {
            const allocations = await this.allocationService.getPendingAllocations();
            return res.json({ success: true, data: allocations });
        }
        catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
    async getByLecturer(req, res) {
        try {
            const lecturerId = parseInt(req.params.lecturerId);
            const allocations = await this.allocationService.getLecturerAllocations(lecturerId);
            return res.json({ success: true, data: allocations });
        }
        catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
    async getByCourse(req, res) {
        try {
            const courseId = parseInt(req.params.courseId);
            const allocations = await this.allocationService.getCourseAllocations(courseId);
            return res.json({ success: true, data: allocations });
        }
        catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
    async getWorkloadDistribution(_req, res) {
        try {
            const distribution = await this.allocationService.getWorkloadDistribution();
            return res.json({ success: true, data: distribution });
        }
        catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
    async manualAllocate(req, res) {
        try {
            const { lecturerId, courseId, assignedBy } = req.body;
            const allocation = await this.allocationService.allocateManually(lecturerId, courseId, assignedBy);
            return res.status(201).json({ success: true, data: allocation });
        }
        catch (error) {
            return res.status(400).json({ success: false, error: error.message });
        }
    }
    async autoAllocate(req, res) {
        try {
            const { assignedBy } = req.body;
            const allocations = await this.allocationService.allocateAutomatically(`session_${Date.now()}`, assignedBy);
            return res.status(201).json({ success: true, data: allocations });
        }
        catch (error) {
            return res.status(400).json({ success: false, error: error.message });
        }
    }
    async validateAllocation(req, res) {
        try {
            const { lecturerId, courseId } = req.body;
            const validation = await this.allocationService.validateAllocation(lecturerId, courseId);
            return res.json({ success: true, data: validation });
        }
        catch (error) {
            return res.status(400).json({ success: false, error: error.message });
        }
    }
    async approve(req, res) {
        try {
            const id = parseInt(req.params.id);
            const { approvedBy } = req.body;
            const allocation = await this.allocationService.approveAllocation(id, approvedBy);
            return res.json({ success: true, data: allocation });
        }
        catch (error) {
            return res.status(400).json({ success: false, error: error.message });
        }
    }
    async reject(req, res) {
        try {
            const id = parseInt(req.params.id);
            const { reason, rejectedBy } = req.body;
            const allocation = await this.allocationService.rejectAllocation(id, reason, rejectedBy);
            return res.json({ success: true, data: allocation });
        }
        catch (error) {
            return res.status(400).json({ success: false, error: error.message });
        }
    }
    async override(req, res) {
        try {
            const id = parseInt(req.params.id);
            const { action, reason, actedBy, newLecturerId } = req.body;
            const allocation = await this.allocationService.overrideAllocation(id, action, reason, actedBy, newLecturerId // Pass the new lecturer ID
            );
            return res.json({ success: true, data: allocation });
        }
        catch (error) {
            return res.status(400).json({ success: false, error: error.message });
        }
    }
    async delete(_req, res) {
        try {
            return res.json({ success: true, message: 'Allocation deleted successfully' });
        }
        catch (error) {
            return res.status(400).json({ success: false, error: error.message });
        }
    }
}
exports.AllocationController = AllocationController;
//# sourceMappingURL=AllocationController.js.map