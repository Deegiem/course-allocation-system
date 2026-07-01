import { Lecturer, Course, ISystemPolicy } from '../entities';
export interface IScoreResult {
    lecturerId: number;
    lecturerName: string;
    courseId: number;
    courseCode: string;
    totalScore: number;
    breakdown: {
        expertiseMatch: number;
        experienceScore: number;
        workloadBalance: number;
        preferenceScore: number;
        performanceScore: number;
        rankBonus: number;
        teachingStyleMatch: number;
    };
    isEligible: boolean;
    eligibilityReasons?: string[];
}
export declare class ScoringEngine {
    private policies;
    constructor(policies: ISystemPolicy);
    calculateScore(lecturer: Lecturer, course: Course, currentWorkload: number): IScoreResult;
    private calculateExpertiseMatch;
    private calculateExperienceScore;
    private calculateWorkloadBalance;
    private calculatePreferenceScore;
    private calculatePerformanceScore;
    private calculateRankBonus;
    private calculateTeachingStyleMatch;
    private checkEligibility;
    private getCourseSpecialization;
    rankLecturersForCourse(lecturers: Lecturer[], course: Course, workloads: Map<number, number>): IScoreResult[];
}
