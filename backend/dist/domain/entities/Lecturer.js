"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lecturer = void 0;
const enums_1 = require("../enums");
class Lecturer {
    constructor(id, staffId, name, email, rank, specialization, teachingStyle, yearsOfExperience, maxHours = 18, isActive = true, createdAt = new Date(), updatedAt = new Date()) {
        this.id = id;
        this.staffId = staffId;
        this.name = name;
        this.email = email;
        this.rank = rank;
        this.specialization = specialization;
        this.teachingStyle = teachingStyle;
        this.yearsOfExperience = yearsOfExperience;
        this.maxHours = maxHours;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    getRankWeight() {
        const weights = {
            [enums_1.Rank.PROFESSOR]: 10,
            [enums_1.Rank.READER]: 9,
            [enums_1.Rank.SENIOR_LECTURER]: 8,
            [enums_1.Rank.LECTURER_I]: 7,
            [enums_1.Rank.LECTURER_II]: 6,
            [enums_1.Rank.ASSISTANT_LECTURER]: 5,
            [enums_1.Rank.GRADUATE_ASSISTANT]: 4,
            [enums_1.Rank.ADJUNCT_LECTURER]: 3,
            [enums_1.Rank.VISITING_LECTURER]: 2
        };
        return weights[this.rank] || 0;
    }
    getExperienceScore() {
        return Math.min(this.yearsOfExperience / 2, 10);
    }
    canTeachCourse(courseSpecialization) {
        return this.specialization.some(spec => spec.toLowerCase().includes(courseSpecialization.toLowerCase()));
    }
    canTakeWorkload(currentWorkload, courseUnits = 3) {
        return currentWorkload + courseUnits <= this.maxHours;
    }
    getSpecializationMatch(courseSpecialization) {
        const matches = this.specialization.filter(spec => spec.toLowerCase().includes(courseSpecialization.toLowerCase()));
        return matches.length > 0 ? 1 : 0;
    }
}
exports.Lecturer = Lecturer;
//# sourceMappingURL=Lecturer.js.map