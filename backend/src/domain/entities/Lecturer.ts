import { Rank, TeachingStyle } from '../enums';

export interface ILecturer {
  id: number;
  staffId: string;
  name: string;
  email: string;
  rank: Rank;
  specialization: string[];
  teachingStyle: TeachingStyle;
  yearsOfExperience: number;
  maxHours: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Lecturer implements ILecturer {
  constructor(
    public id: number,
    public staffId: string,
    public name: string,
    public email: string,
    public rank: Rank,
    public specialization: string[],
    public teachingStyle: TeachingStyle,
    public yearsOfExperience: number,
    public maxHours: number = 18,
    public isActive: boolean = true,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  getRankWeight(): number {
    const weights: Record<Rank, number> = {
      [Rank.PROFESSOR]: 10,
      [Rank.READER]: 9,
      [Rank.SENIOR_LECTURER]: 8,
      [Rank.LECTURER_I]: 7,
      [Rank.LECTURER_II]: 6,
      [Rank.ASSISTANT_LECTURER]: 5,
      [Rank.GRADUATE_ASSISTANT]: 4,
      [Rank.ADJUNCT_LECTURER]: 3,
      [Rank.VISITING_LECTURER]: 2
    };
    return weights[this.rank] || 0;
  }

  getExperienceScore(): number {
    return Math.min(this.yearsOfExperience / 2, 10);
  }

  canTeachCourse(courseSpecialization: string): boolean {
    return this.specialization.some(spec =>
      spec.toLowerCase().includes(courseSpecialization.toLowerCase())
    );
  }

  canTakeWorkload(currentWorkload: number, courseUnits: number = 3): boolean {
    return currentWorkload + courseUnits <= this.maxHours;
  }

  getSpecializationMatch(courseSpecialization: string): number {
    const matches = this.specialization.filter(spec =>
      spec.toLowerCase().includes(courseSpecialization.toLowerCase())
    );
    return matches.length > 0 ? 1 : 0;
  }
}