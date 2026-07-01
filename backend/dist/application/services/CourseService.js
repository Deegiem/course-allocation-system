"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseService = void 0;
const BaseService_1 = require("./BaseService");
class CourseService extends BaseService_1.BaseService {
    constructor(courseRepository) {
        super();
        this.courseRepository = courseRepository;
    }
    async createCourse(data) {
        try {
            // Validate required fields
            this.validateRequiredFields(data, ['code', 'title', 'units', 'level', 'nature']);
            // Validate lectureHours and practicalHours based on nature
            if (data.nature !== 'PRACTICAL_ONLY' && data.lectureHours === undefined) {
                throw new Error('Lecture hours are required for theory or mixed courses');
            }
            if (data.nature !== 'THEORY_ONLY' && data.practicalHours === undefined) {
                throw new Error('Practical hours are required for practical or mixed courses');
            }
            // Set default hours based on nature
            let lectureHours = data.lectureHours || 0;
            let practicalHours = data.practicalHours || 0;
            if (data.nature === 'THEORY_ONLY') {
                practicalHours = 0;
                if (!lectureHours)
                    lectureHours = 3;
            }
            else if (data.nature === 'PRACTICAL_ONLY') {
                lectureHours = 0;
                if (!practicalHours)
                    practicalHours = 3;
            }
            else if (data.nature === 'THEORY_AND_PRACTICAL') {
                if (!lectureHours)
                    lectureHours = 2;
                if (!practicalHours)
                    practicalHours = 2;
            }
            const existing = await this.courseRepository.findByCode(data.code);
            if (existing) {
                throw new Error(`Course with code ${data.code} already exists`);
            }
            const courseData = {
                ...data,
                lectureHours,
                practicalHours,
                status: data.status !== undefined ? data.status : true
            };
            return await this.courseRepository.create(courseData);
        }
        catch (error) {
            return await this.handleError(error);
        }
    }
    async updateCourse(id, data) {
        try {
            const course = await this.courseRepository.findById(id);
            if (!course) {
                throw new Error(`Course with ID ${id} not found`);
            }
            if (data.code && data.code !== course.code) {
                const existing = await this.courseRepository.findByCode(data.code);
                if (existing) {
                    throw new Error(`Course with code ${data.code} already exists`);
                }
            }
            // Handle hours based on nature
            if (data.nature) {
                if (data.nature === 'THEORY_ONLY') {
                    data.practicalHours = 0;
                }
                else if (data.nature === 'PRACTICAL_ONLY') {
                    data.lectureHours = 0;
                }
            }
            return await this.courseRepository.update(id, data);
        }
        catch (error) {
            return await this.handleError(error);
        }
    }
    async deleteCourse(id) {
        try {
            const course = await this.courseRepository.findById(id);
            if (!course) {
                throw new Error(`Course with ID ${id} not found`);
            }
            await this.courseRepository.delete(id);
        }
        catch (error) {
            await this.handleError(error);
        }
    }
    async getCourse(id) {
        return await this.courseRepository.findById(id);
    }
    async getAllCourses() {
        return await this.courseRepository.findAll();
    }
    async getActiveCourses() {
        return await this.courseRepository.findActive();
    }
    async getCoursesByLevel(level) {
        return await this.courseRepository.findByLevel(level);
    }
    async getCourseAllocations(id) {
        const course = await this.courseRepository.findById(id);
        if (!course) {
            throw new Error(`Course with ID ${id} not found`);
        }
        return await this.courseRepository.findById(id);
    }
    async getCourseByCode(code) {
        return await this.courseRepository.findByCode(code);
    }
    async getUnallocatedCourses() {
        return await this.courseRepository.getUnallocatedCourses();
    }
}
exports.CourseService = CourseService;
//# sourceMappingURL=CourseService.js.map