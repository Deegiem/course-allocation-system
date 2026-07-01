"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLog = void 0;
class AuditLog {
    constructor(id, actionType, entity, entityId, timestamp = new Date(), payload, lecturerId, courseId, allocationId) {
        this.id = id;
        this.actionType = actionType;
        this.entity = entity;
        this.entityId = entityId;
        this.timestamp = timestamp;
        this.payload = payload;
        this.lecturerId = lecturerId;
        this.courseId = courseId;
        this.allocationId = allocationId;
    }
    static createLecturerAction(action, lecturerId, payload) {
        return new AuditLog(0, action, 'Lecturer', lecturerId, new Date(), payload, lecturerId);
    }
    static createCourseAction(action, courseId, payload) {
        return new AuditLog(0, action, 'Course', courseId, new Date(), payload, undefined, courseId);
    }
    static createAllocationAction(action, allocationId, lecturerId, courseId, payload) {
        return new AuditLog(0, action, 'Allocation', allocationId, new Date(), payload, lecturerId, courseId, allocationId);
    }
}
exports.AuditLog = AuditLog;
//# sourceMappingURL=AuditLog.js.map