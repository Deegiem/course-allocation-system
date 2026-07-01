"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LecturerService = void 0;
const BaseService_1 = require("./BaseService");
class LecturerService extends BaseService_1.BaseService {
    constructor(lecturerRepository) {
        super();
        this.lecturerRepository = lecturerRepository;
    }
    async createLecturer(data) {
        try {
            this.validateRequiredFields(data, ['staffId', 'name', 'email', 'rank', 'specialization', 'teachingStyle', 'yearsOfExperience']);
            const existing = await this.lecturerRepository.findByStaffId(data.staffId);
            if (existing) {
                throw new Error(`Lecturer with staff ID ${data.staffId} already exists`);
            }
            const existingEmail = await this.lecturerRepository.findByEmail(data.email);
            if (existingEmail) {
                throw new Error(`Lecturer with email ${data.email} already exists`);
            }
            return await this.lecturerRepository.create(data);
        }
        catch (error) {
            return await this.handleError(error);
        }
    }
    async updateLecturer(id, data) {
        try {
            const lecturer = await this.lecturerRepository.findById(id);
            if (!lecturer) {
                throw new Error(`Lecturer with ID ${id} not found`);
            }
            if (data.email && data.email !== lecturer.email) {
                const existing = await this.lecturerRepository.findByEmail(data.email);
                if (existing) {
                    throw new Error(`Lecturer with email ${data.email} already exists`);
                }
            }
            return await this.lecturerRepository.update(id, data);
        }
        catch (error) {
            return await this.handleError(error);
        }
    }
    async deleteLecturer(id) {
        try {
            const lecturer = await this.lecturerRepository.findById(id);
            if (!lecturer) {
                throw new Error(`Lecturer with ID ${id} not found`);
            }
            await this.lecturerRepository.delete(id);
        }
        catch (error) {
            await this.handleError(error);
        }
    }
    async getLecturer(id) {
        return await this.lecturerRepository.findById(id);
    }
    async getAllLecturers() {
        return await this.lecturerRepository.findAll();
    }
    async getActiveLecturers() {
        return await this.lecturerRepository.findActive();
    }
    async getLecturerWorkload(id) {
        const lecturer = await this.lecturerRepository.findById(id);
        if (!lecturer) {
            throw new Error(`Lecturer with ID ${id} not found`);
        }
        return await this.lecturerRepository.getWorkload(id);
    }
    async getLecturerAllocations(id) {
        const lecturer = await this.lecturerRepository.findById(id);
        if (!lecturer) {
            throw new Error(`Lecturer with ID ${id} not found`);
        }
        return await this.lecturerRepository.getCurrentAllocations(id);
    }
    async getLecturerByStaffId(staffId) {
        return await this.lecturerRepository.findByStaffId(staffId);
    }
    async getLecturerByEmail(email) {
        return await this.lecturerRepository.findByEmail(email);
    }
    async searchLecturers(query) {
        const allLecturers = await this.lecturerRepository.findAll();
        const lowerQuery = query.toLowerCase();
        return allLecturers.filter(l => l.name.toLowerCase().includes(lowerQuery) ||
            l.staffId.toLowerCase().includes(lowerQuery) ||
            l.email.toLowerCase().includes(lowerQuery) ||
            l.specialization.some(s => s.toLowerCase().includes(lowerQuery)));
    }
}
exports.LecturerService = LecturerService;
//# sourceMappingURL=LecturerService.js.map