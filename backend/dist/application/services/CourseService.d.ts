import { ICourseService } from '../../domain/interfaces/IService';
import { ICourseRepository } from '../../domain/interfaces/IRepository';
import { ICourse } from '../../domain/entities';
import { BaseService } from './BaseService';
export declare class CourseService extends BaseService implements ICourseService {
    private courseRepository;
    constructor(courseRepository: ICourseRepository);
    createCourse(data: Partial<ICourse>): Promise<ICourse>;
    updateCourse(id: number, data: Partial<ICourse>): Promise<ICourse>;
    deleteCourse(id: number): Promise<void>;
    getCourse(id: number): Promise<ICourse | null>;
    getAllCourses(): Promise<ICourse[]>;
    getActiveCourses(): Promise<ICourse[]>;
    getCoursesByLevel(level: number): Promise<ICourse[]>;
    getCourseAllocations(id: number): Promise<any[]>;
    getCourseByCode(code: string): Promise<ICourse | null>;
    getUnallocatedCourses(): Promise<ICourse[]>;
}
