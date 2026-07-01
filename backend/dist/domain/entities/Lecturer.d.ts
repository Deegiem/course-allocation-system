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
export declare class Lecturer implements ILecturer {
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
    constructor(id: number, staffId: string, name: string, email: string, rank: Rank, specialization: string[], teachingStyle: TeachingStyle, yearsOfExperience: number, maxHours?: number, isActive?: boolean, createdAt?: Date, updatedAt?: Date);
    getRankWeight(): number;
    getExperienceScore(): number;
    canTeachCourse(courseSpecialization: string): boolean;
    canTakeWorkload(currentWorkload: number, courseUnits?: number): boolean;
    getSpecializationMatch(courseSpecialization: string): number;
}
