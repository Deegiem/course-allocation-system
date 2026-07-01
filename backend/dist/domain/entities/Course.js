"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Course = void 0;
const enums_1 = require("../enums");
class Course {
    constructor(id, code, title, units, level, nature, lectureHours, practicalHours, status = true, createdAt = new Date(), updatedAt = new Date()) {
        this.id = id;
        this.code = code;
        this.title = title;
        this.units = units;
        this.level = level;
        this.nature = nature;
        this.lectureHours = lectureHours;
        this.practicalHours = practicalHours;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    getTotalHours() {
        return this.lectureHours + this.practicalHours;
    }
    isTheory() {
        return this.nature === enums_1.CourseNature.THEORY_ONLY;
    }
    isPractical() {
        return this.nature === enums_1.CourseNature.PRACTICAL_ONLY;
    }
    isMixed() {
        return this.nature === enums_1.CourseNature.THEORY_AND_PRACTICAL;
    }
    getSpecialization() {
        if (this.code.includes('CSC'))
            return 'Computer Science';
        if (this.code.includes('MTH'))
            return 'Mathematics';
        if (this.code.includes('PHY'))
            return 'Physics';
        if (this.code.includes('STA'))
            return 'Statistics';
        return 'General';
    }
}
exports.Course = Course;
//# sourceMappingURL=Course.js.map