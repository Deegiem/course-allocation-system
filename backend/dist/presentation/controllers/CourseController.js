"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseController = void 0;
class CourseController {
    constructor(courseService) {
        this.courseService = courseService;
    }
    async getAll(_req, res) {
        try {
            const courses = await this.courseService.getAllCourses();
            return res.json({ success: true, data: courses });
        }
        catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
    async getActive(_req, res) {
        try {
            const courses = await this.courseService.getActiveCourses();
            return res.json({ success: true, data: courses });
        }
        catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
    async getByLevel(req, res) {
        try {
            const level = parseInt(req.params.level);
            const courses = await this.courseService.getCoursesByLevel(level);
            return res.json({ success: true, data: courses });
        }
        catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
    async getUnallocated(_req, res) {
        try {
            const courses = await this.courseService.getUnallocatedCourses();
            return res.json({ success: true, data: courses });
        }
        catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
    async getById(req, res) {
        try {
            const id = parseInt(req.params.id);
            const course = await this.courseService.getCourse(id);
            if (!course) {
                return res.status(404).json({ success: false, error: 'Course not found' });
            }
            return res.json({ success: true, data: course });
        }
        catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
    async create(req, res) {
        try {
            const course = await this.courseService.createCourse(req.body);
            return res.status(201).json({ success: true, data: course });
        }
        catch (error) {
            return res.status(400).json({ success: false, error: error.message });
        }
    }
    async update(req, res) {
        try {
            const id = parseInt(req.params.id);
            const course = await this.courseService.updateCourse(id, req.body);
            return res.json({ success: true, data: course });
        }
        catch (error) {
            return res.status(400).json({ success: false, error: error.message });
        }
    }
    async delete(req, res) {
        try {
            const id = parseInt(req.params.id);
            // Check if course exists
            const course = await this.courseService.getCourse(id);
            if (!course) {
                return res.status(404).json({ success: false, error: 'Course not found' });
            }
            // Check if course has active allocations
            const allocations = await this.courseService.getCourseAllocations(id);
            const activeAllocations = allocations.filter(a => a.status === 'AUTO_ALLOCATED' || a.status === 'APPROVED' || a.status === 'OVERRIDDEN');
            if (activeAllocations.length > 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Cannot delete course with active allocations. Please remove allocations first.'
                });
            }
            await this.courseService.deleteCourse(id);
            return res.json({ success: true, message: 'Course deleted successfully' });
        }
        catch (error) {
            return res.status(400).json({ success: false, error: error.message });
        }
    }
}
exports.CourseController = CourseController;
//# sourceMappingURL=CourseController.js.map