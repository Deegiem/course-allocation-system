"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LecturerController = void 0;
class LecturerController {
    constructor(lecturerService) {
        this.lecturerService = lecturerService;
    }
    async getAll(_req, res) {
        try {
            const lecturers = await this.lecturerService.getAllLecturers();
            return res.json({ success: true, data: lecturers });
        }
        catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
    async getActive(_req, res) {
        try {
            const lecturers = await this.lecturerService.getActiveLecturers();
            return res.json({ success: true, data: lecturers });
        }
        catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
    async getById(req, res) {
        try {
            const id = parseInt(req.params.id);
            const lecturer = await this.lecturerService.getLecturer(id);
            if (!lecturer) {
                return res.status(404).json({ success: false, error: 'Lecturer not found' });
            }
            return res.json({ success: true, data: lecturer });
        }
        catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
    async getByStaffId(req, res) {
        try {
            const lecturer = await this.lecturerService.getLecturerByStaffId(req.params.staffId);
            if (!lecturer) {
                return res.status(404).json({ success: false, error: 'Lecturer not found' });
            }
            return res.json({ success: true, data: lecturer });
        }
        catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
    async getWorkload(req, res) {
        try {
            const id = parseInt(req.params.id);
            const workload = await this.lecturerService.getLecturerWorkload(id);
            return res.json({ success: true, data: workload });
        }
        catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
    async getAllocations(req, res) {
        try {
            const id = parseInt(req.params.id);
            const allocations = await this.lecturerService.getLecturerAllocations(id);
            return res.json({ success: true, data: allocations });
        }
        catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
    async create(req, res) {
        try {
            const lecturer = await this.lecturerService.createLecturer(req.body);
            return res.status(201).json({ success: true, data: lecturer });
        }
        catch (error) {
            return res.status(400).json({ success: false, error: error.message });
        }
    }
    async update(req, res) {
        try {
            const id = parseInt(req.params.id);
            const lecturer = await this.lecturerService.updateLecturer(id, req.body);
            return res.json({ success: true, data: lecturer });
        }
        catch (error) {
            return res.status(400).json({ success: false, error: error.message });
        }
    }
    async delete(req, res) {
        try {
            const id = parseInt(req.params.id);
            await this.lecturerService.deleteLecturer(id);
            return res.json({ success: true, message: 'Lecturer deleted successfully' });
        }
        catch (error) {
            return res.status(400).json({ success: false, error: error.message });
        }
    }
}
exports.LecturerController = LecturerController;
//# sourceMappingURL=LecturerController.js.map