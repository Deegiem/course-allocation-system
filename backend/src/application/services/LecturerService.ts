import { ILecturerService } from '../../domain/interfaces/IService';
import { ILecturerRepository } from '../../domain/interfaces/IRepository';
import { ILecturer } from '../../domain/entities';
import { BaseService } from './BaseService';

export class LecturerService extends BaseService implements ILecturerService {
    constructor(private lecturerRepository: ILecturerRepository) {
        super();
    }

    async createLecturer(data: Partial<ILecturer>): Promise<ILecturer> {
        try {
            this.validateRequiredFields(data, ['staffId', 'name', 'email', 'rank', 'specialization', 'teachingStyle', 'yearsOfExperience']);

            const existing = await this.lecturerRepository.findByStaffId(data.staffId!);
            if (existing) {
                throw new Error(`Lecturer with staff ID ${data.staffId} already exists`);
            }

            const existingEmail = await this.lecturerRepository.findByEmail(data.email!);
            if (existingEmail) {
                throw new Error(`Lecturer with email ${data.email} already exists`);
            }

            return await this.lecturerRepository.create(data);
        } catch (error) {
            return await this.handleError(error);
        }
    }

    async updateLecturer(id: number, data: Partial<ILecturer>): Promise<ILecturer> {
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
        } catch (error) {
            return await this.handleError(error);
        }
    }

    async deleteLecturer(id: number): Promise<void> {
        try {
            const lecturer = await this.lecturerRepository.findById(id);
            if (!lecturer) {
                throw new Error(`Lecturer with ID ${id} not found`);
            }
            await this.lecturerRepository.delete(id);
        } catch (error) {
            await this.handleError(error);
        }
    }

    async getLecturer(id: number): Promise<ILecturer | null> {
        return await this.lecturerRepository.findById(id);
    }

    async getAllLecturers(): Promise<ILecturer[]> {
        return await this.lecturerRepository.findAll();
    }

    async getActiveLecturers(): Promise<ILecturer[]> {
        return await this.lecturerRepository.findActive();
    }

    async getLecturerWorkload(id: number): Promise<number> {
        const lecturer = await this.lecturerRepository.findById(id);
        if (!lecturer) {
            throw new Error(`Lecturer with ID ${id} not found`);
        }
        return await this.lecturerRepository.getWorkload(id);
    }

    async getLecturerAllocations(id: number): Promise<any[]> {
        const lecturer = await this.lecturerRepository.findById(id);
        if (!lecturer) {
            throw new Error(`Lecturer with ID ${id} not found`);
        }
        return await this.lecturerRepository.getCurrentAllocations(id);
    }

    async getLecturerByStaffId(staffId: string): Promise<ILecturer | null> {
        return await this.lecturerRepository.findByStaffId(staffId);
    }

    async getLecturerByEmail(email: string): Promise<ILecturer | null> {
        return await this.lecturerRepository.findByEmail(email);
    }

    async searchLecturers(query: string): Promise<ILecturer[]> {
        const allLecturers = await this.lecturerRepository.findAll();
        const lowerQuery = query.toLowerCase();
        return allLecturers.filter(l =>
            l.name.toLowerCase().includes(lowerQuery) ||
            l.staffId.toLowerCase().includes(lowerQuery) ||
            l.email.toLowerCase().includes(lowerQuery) ||
            l.specialization.some(s => s.toLowerCase().includes(lowerQuery))
        );
    }
}