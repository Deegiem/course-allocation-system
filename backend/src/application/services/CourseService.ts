import { ICourseService } from '../../domain/interfaces/IService';
import { ICourseRepository } from '../../domain/interfaces/IRepository';
import { ICourse } from '../../domain/entities';
import { BaseService } from './BaseService';

export class CourseService extends BaseService implements ICourseService {
  constructor(private courseRepository: ICourseRepository) {
    super();
  }

  async createCourse(data: Partial<ICourse>): Promise<ICourse> {
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
        if (!lectureHours) lectureHours = 3;
      } else if (data.nature === 'PRACTICAL_ONLY') {
        lectureHours = 0;
        if (!practicalHours) practicalHours = 3;
      } else if (data.nature === 'THEORY_AND_PRACTICAL') {
        if (!lectureHours) lectureHours = 2;
        if (!practicalHours) practicalHours = 2;
      }
      
      const existing = await this.courseRepository.findByCode(data.code!);
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
    } catch (error) {
      return await this.handleError(error);
    }
  }

  async updateCourse(id: number, data: Partial<ICourse>): Promise<ICourse> {
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
        } else if (data.nature === 'PRACTICAL_ONLY') {
          data.lectureHours = 0;
        }
      }

      return await this.courseRepository.update(id, data);
    } catch (error) {
      return await this.handleError(error);
    }
  }

  async deleteCourse(id: number): Promise<void> {
    try {
      const course = await this.courseRepository.findById(id);
      if (!course) {
        throw new Error(`Course with ID ${id} not found`);
      }
      await this.courseRepository.delete(id);
    } catch (error) {
      await this.handleError(error);
    }
  }

  async getCourse(id: number): Promise<ICourse | null> {
    return await this.courseRepository.findById(id);
  }

  async getAllCourses(): Promise<ICourse[]> {
    return await this.courseRepository.findAll();
  }

  async getActiveCourses(): Promise<ICourse[]> {
    return await this.courseRepository.findActive();
  }

  async getCoursesByLevel(level: number): Promise<ICourse[]> {
    return await this.courseRepository.findByLevel(level);
  }

  async getCourseAllocations(id: number): Promise<any[]> {
    const course = await this.courseRepository.findById(id);
    if (!course) {
      throw new Error(`Course with ID ${id} not found`);
    }
    return await this.courseRepository.findById(id) as any;
  }

  async getCourseByCode(code: string): Promise<ICourse | null> {
    return await this.courseRepository.findByCode(code);
  }

  async getUnallocatedCourses(): Promise<ICourse[]> {
    return await this.courseRepository.getUnallocatedCourses();
  }
}