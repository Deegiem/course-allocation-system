import { PrismaClient, Course as PrismaCourse } from '@prisma/client';
import { ICourseRepository } from '../../domain/interfaces/IRepository';
import { Course, ICourse } from '../../domain/entities';
import { BaseRepository } from './BaseRepository';

export class CourseRepository extends BaseRepository<ICourse> implements ICourseRepository {
  constructor(prisma: PrismaClient) {
    super(prisma, 'course');
  }

  async create(data: Partial<ICourse>): Promise<ICourse> {
    const result = await this.prisma.course.create({
      data: {
        code: data.code!,
        title: data.title!,
        units: data.units!,
        level: data.level!,
        nature: data.nature! as any,
        lectureHours: data.lectureHours!,
        practicalHours: data.practicalHours!,
        status: data.status !== undefined ? data.status : true
      }
    });
    return this.mapToEntity(result);
  }

  async update(id: number, data: Partial<ICourse>): Promise<ICourse> {
    const result = await this.prisma.course.update({
      where: { id },
      data: {
        code: data.code,
        title: data.title,
        units: data.units,
        level: data.level,
        nature: data.nature as any,
        lectureHours: data.lectureHours,
        practicalHours: data.practicalHours,
        status: data.status
      }
    });
    return this.mapToEntity(result);
  }

  async findByCode(code: string): Promise<ICourse | null> {
    const result = await this.prisma.course.findUnique({
      where: { code }
    });
    return result ? this.mapToEntity(result) : null;
  }

  async findByLevel(level: number): Promise<ICourse[]> {
    const results = await this.prisma.course.findMany({
      where: { level }
    });
    return results.map(r => this.mapToEntity(r));
  }

  async findActive(): Promise<ICourse[]> {
    const results = await this.prisma.course.findMany({
      where: { status: true }
    });
    return results.map(r => this.mapToEntity(r));
  }

  async getUnallocatedCourses(): Promise<ICourse[]> {
    const results = await this.prisma.course.findMany({
      where: {
        status: true,
        allocations: {
          none: {
            status: { in: ['AUTO_ALLOCATED', 'APPROVED', 'OVERRIDDEN'] }
          }
        }
      }
    });
    return results.map(r => this.mapToEntity(r));
  }

  private mapToEntity(prismaData: PrismaCourse): ICourse {
    return new Course(
      prismaData.id,
      prismaData.code,
      prismaData.title,
      prismaData.units,
      prismaData.level,
      prismaData.nature as any,
      prismaData.lectureHours,
      prismaData.practicalHours,
      prismaData.status,
      prismaData.createdAt,
      prismaData.updatedAt
    );
  }
}