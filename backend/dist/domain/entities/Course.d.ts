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
export declare class Course implements ICourse {
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
    constructor(id: number, code: string, title: string, units: number, level: number, nature: CourseNature, lectureHours: number, practicalHours: number, status?: boolean, createdAt?: Date, updatedAt?: Date);
    getTotalHours(): number;
    isTheory(): boolean;
    isPractical(): boolean;
    isMixed(): boolean;
    getSpecialization(): string;
}
