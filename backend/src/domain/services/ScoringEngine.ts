import { Lecturer, Course, ISystemPolicy } from '../entities';
import { RankWeight } from '../enums';

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

export class ScoringEngine {
  constructor(private policies: ISystemPolicy) {}

  calculateScore(lecturer: Lecturer, course: Course, currentWorkload: number): IScoreResult {
    const breakdown = {
      expertiseMatch: this.calculateExpertiseMatch(lecturer, course),
      experienceScore: this.calculateExperienceScore(lecturer),
      workloadBalance: this.calculateWorkloadBalance(lecturer, currentWorkload, course),
      preferenceScore: this.calculatePreferenceScore(),
      performanceScore: this.calculatePerformanceScore(),
      rankBonus: this.calculateRankBonus(lecturer),
      teachingStyleMatch: this.calculateTeachingStyleMatch(lecturer, course)
    };

    const eligibility = this.checkEligibility(lecturer, course, currentWorkload);
    
    const totalScore = 
      (breakdown.expertiseMatch * this.policies.weights.expertise) +
      (breakdown.experienceScore * this.policies.weights.experience) +
      (breakdown.workloadBalance * this.policies.weights.workload) +
      (breakdown.preferenceScore * this.policies.weights.preference) +
      (breakdown.performanceScore * this.policies.weights.performance);

    return {
      lecturerId: lecturer.id,
      lecturerName: lecturer.name,
      courseId: course.id,
      courseCode: course.code,
      totalScore,
      breakdown,
      isEligible: eligibility.isEligible,
      eligibilityReasons: eligibility.reasons
    };
  }

  private calculateExpertiseMatch(lecturer: Lecturer, course: Course): number {
    const courseSpecialization = this.getCourseSpecialization(course);
    if (!courseSpecialization) return 0.5;

    const matchingSpecializations = lecturer.specialization.filter(spec =>
      spec.toLowerCase().includes(courseSpecialization.toLowerCase()) ||
      courseSpecialization.toLowerCase().includes(spec.toLowerCase())
    );

    if (matchingSpecializations.length === 0) return 0;
    
    const matchRatio = matchingSpecializations.length / lecturer.specialization.length;
    return Math.min(matchRatio, 1);
  }

  private calculateExperienceScore(lecturer: Lecturer): number {
    const years = lecturer.yearsOfExperience;
    if (years < 5) return 0.2 + (years / 5) * 0.3;
    if (years < 10) return 0.5 + ((years - 5) / 5) * 0.2;
    if (years < 15) return 0.7 + ((years - 10) / 5) * 0.2;
    if (years < 20) return 0.9 + ((years - 15) / 5) * 0.1;
    return 1.0;
  }

  private calculateWorkloadBalance(
    lecturer: Lecturer,
    currentWorkload: number,
    course: Course
  ): number {
    const newWorkload = currentWorkload + course.units;
    const maxLoad = lecturer.maxHours;
    
    const targetUtilization = 0.75;
    const newUtilization = newWorkload / maxLoad;
    
    if (newUtilization > 1) return 0;
    
    const proximityToTarget = 1 - Math.abs(newUtilization - targetUtilization);
    return Math.max(0, Math.min(proximityToTarget, 1));
  }

  private calculatePreferenceScore(): number {
    return 0.5;
  }

  private calculatePerformanceScore(): number {
    return 0.5;
  }

  private calculateRankBonus(lecturer: Lecturer): number {
    const rankWeight = RankWeight[lecturer.rank] || 5;
    return rankWeight / 10;
  }

  private calculateTeachingStyleMatch(lecturer: Lecturer, course: Course): number {
    if (course.isTheory() && lecturer.teachingStyle === 'LECTURE_BASED') return 1.0;
    if (course.isPractical() && lecturer.teachingStyle === 'PRACTICAL_BASED') return 1.0;
    if (course.isMixed() && lecturer.teachingStyle === 'MIXED_METHOD') return 1.0;
    
    if (course.isTheory() && lecturer.teachingStyle === 'MIXED_METHOD') return 0.7;
    if (course.isPractical() && lecturer.teachingStyle === 'MIXED_METHOD') return 0.7;
    if (course.isMixed() && (lecturer.teachingStyle === 'LECTURE_BASED' || lecturer.teachingStyle === 'PRACTICAL_BASED')) return 0.6;
    
    return 0.3;
  }

  private checkEligibility(
    lecturer: Lecturer,
    course: Course,
    currentWorkload: number
  ): { isEligible: boolean; reasons?: string[] } {
    const reasons: string[] = [];

    if (!lecturer.isActive) {
      reasons.push('Lecturer is not active');
    }

    const newWorkload = currentWorkload + course.units;
    if (newWorkload > lecturer.maxHours) {
      reasons.push(`Would exceed max workload (${lecturer.maxHours} hours)`);
    }

    if (this.policies.specializationStrictMode) {
      const courseSpecialization = this.getCourseSpecialization(course);
      if (courseSpecialization && !lecturer.canTeachCourse(courseSpecialization)) {
        reasons.push(`No specialization match for ${courseSpecialization}`);
      }
    }

    return {
      isEligible: reasons.length === 0,
      reasons: reasons.length > 0 ? reasons : undefined
    };
  }

  private getCourseSpecialization(course: Course): string {
    if (course.code.includes('CSC')) return 'Computer Science';
    if (course.code.includes('MTH')) return 'Mathematics';
    if (course.code.includes('PHY')) return 'Physics';
    if (course.code.includes('STA')) return 'Statistics';
    if (course.code.includes('ENG')) return 'Engineering';
    if (course.code.includes('BIO')) return 'Biology';
    if (course.code.includes('CHE')) return 'Chemistry';
    return 'General';
  }

  rankLecturersForCourse(
    lecturers: Lecturer[],
    course: Course,
    workloads: Map<number, number>
  ): IScoreResult[] {
    const results: IScoreResult[] = [];

    for (const lecturer of lecturers) {
      const currentWorkload = workloads.get(lecturer.id) || 0;
      const score = this.calculateScore(lecturer, course, currentWorkload);
      
      if (score.isEligible) {
        results.push(score);
      }
    }

    return results.sort((a, b) => b.totalScore - a.totalScore);
  }
}