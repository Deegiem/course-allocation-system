import { ILecturerService } from '../../domain/interfaces/IService';
import { ILecturerRepository } from '../../domain/interfaces/IRepository';
import { ILecturer } from '../../domain/entities';
import { BaseService } from './BaseService';
export declare class LecturerService extends BaseService implements ILecturerService {
    private lecturerRepository;
    constructor(lecturerRepository: ILecturerRepository);
    createLecturer(data: Partial<ILecturer>): Promise<ILecturer>;
    updateLecturer(id: number, data: Partial<ILecturer>): Promise<ILecturer>;
    deleteLecturer(id: number): Promise<void>;
    getLecturer(id: number): Promise<ILecturer | null>;
    getAllLecturers(): Promise<ILecturer[]>;
    getActiveLecturers(): Promise<ILecturer[]>;
    getLecturerWorkload(id: number): Promise<number>;
    getLecturerAllocations(id: number): Promise<any[]>;
    getLecturerByStaffId(staffId: string): Promise<ILecturer | null>;
    getLecturerByEmail(email: string): Promise<ILecturer | null>;
    searchLecturers(query: string): Promise<ILecturer[]>;
}
