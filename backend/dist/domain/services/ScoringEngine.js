"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScoringEngine = void 0;
const enums_1 = require("../enums");
class ScoringEngine {
    constructor(policies) {
        this.policies = policies;
    }
    calculateScore(lecturer, course, currentWorkload) {
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
        const totalScore = (breakdown.expertiseMatch * this.policies.weights.expertise) +
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
    calculateExpertiseMatch(lecturer, course) {
        const courseSpecialization = this.getCourseSpecialization(course);
        if (!courseSpecialization)
            return 0.5;
        const matchingSpecializations = lecturer.specialization.filter(spec => spec.toLowerCase().includes(courseSpecialization.toLowerCase()) ||
            courseSpecialization.toLowerCase().includes(spec.toLowerCase()));
        if (matchingSpecializations.length === 0)
            return 0;
        const matchRatio = matchingSpecializations.length / lecturer.specialization.length;
        return Math.min(matchRatio, 1);
    }
    calculateExperienceScore(lecturer) {
        const years = lecturer.yearsOfExperience;
        if (years < 5)
            return 0.2 + (years / 5) * 0.3;
        if (years < 10)
            return 0.5 + ((years - 5) / 5) * 0.2;
        if (years < 15)
            return 0.7 + ((years - 10) / 5) * 0.2;
        if (years < 20)
            return 0.9 + ((years - 15) / 5) * 0.1;
        return 1.0;
    }
    calculateWorkloadBalance(lecturer, currentWorkload, course) {
        const newWorkload = currentWorkload + course.units;
        const maxLoad = lecturer.maxHours;
        const targetUtilization = 0.75;
        const newUtilization = newWorkload / maxLoad;
        if (newUtilization > 1)
            return 0;
        const proximityToTarget = 1 - Math.abs(newUtilization - targetUtilization);
        return Math.max(0, Math.min(proximityToTarget, 1));
    }
    calculatePreferenceScore() {
        return 0.5;
    }
    calculatePerformanceScore() {
        return 0.5;
    }
    calculateRankBonus(lecturer) {
        const rankWeight = enums_1.RankWeight[lecturer.rank] || 5;
        return rankWeight / 10;
    }
    calculateTeachingStyleMatch(lecturer, course) {
        if (course.isTheory() && lecturer.teachingStyle === 'LECTURE_BASED')
            return 1.0;
        if (course.isPractical() && lecturer.teachingStyle === 'PRACTICAL_BASED')
            return 1.0;
        if (course.isMixed() && lecturer.teachingStyle === 'MIXED_METHOD')
            return 1.0;
        if (course.isTheory() && lecturer.teachingStyle === 'MIXED_METHOD')
            return 0.7;
        if (course.isPractical() && lecturer.teachingStyle === 'MIXED_METHOD')
            return 0.7;
        if (course.isMixed() && (lecturer.teachingStyle === 'LECTURE_BASED' || lecturer.teachingStyle === 'PRACTICAL_BASED'))
            return 0.6;
        return 0.3;
    }
    checkEligibility(lecturer, course, currentWorkload) {
        const reasons = [];
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
    getCourseSpecialization(course) {
        if (course.code.includes('CSC'))
            return 'Computer Science';
        if (course.code.includes('MTH'))
            return 'Mathematics';
        if (course.code.includes('PHY'))
            return 'Physics';
        if (course.code.includes('STA'))
            return 'Statistics';
        if (course.code.includes('ENG'))
            return 'Engineering';
        if (course.code.includes('BIO'))
            return 'Biology';
        if (course.code.includes('CHE'))
            return 'Chemistry';
        return 'General';
    }
    rankLecturersForCourse(lecturers, course, workloads) {
        const results = [];
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
exports.ScoringEngine = ScoringEngine;
//# sourceMappingURL=ScoringEngine.js.map