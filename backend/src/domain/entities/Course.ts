import { CourseNature } from '../enums';

export interface ICourse {
  id: number;
  code: string;
  title: string;
  units: number;
  level: number;
  nature: CourseNature;
  lectureHours: number;
  practicalHours: number;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Course implements ICourse {
  constructor(
    public id: number,
    public code: string,
    public title: string,
    public units: number,
    public level: number,
    public nature: CourseNature,
    public lectureHours: number,
    public practicalHours: number,
    public status: boolean = true,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  getTotalHours(): number {
    return this.lectureHours + this.practicalHours;
  }

  isTheory(): boolean {
    return this.nature === CourseNature.THEORY_ONLY;
  }

  isPractical(): boolean {
    return this.nature === CourseNature.PRACTICAL_ONLY;
  }

  isMixed(): boolean {
    return this.nature === CourseNature.THEORY_AND_PRACTICAL;
  }

  getSpecialization(): string {
    if (this.code.includes('CSC')) return 'Computer Science';
    if (this.code.includes('MTH')) return 'Mathematics';
    if (this.code.includes('PHY')) return 'Physics';
    if (this.code.includes('STA')) return 'Statistics';
    return 'General';
  }
}
