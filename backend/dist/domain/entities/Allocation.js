"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Allocation = void 0;
const enums_1 = require("../enums");
class Allocation {
    constructor(id, lecturerId, courseId, assignedBy, status = enums_1.AllocationStatus.PENDING, score, overrideReason, assignedAt = new Date(), createdAt = new Date(), updatedAt = new Date()) {
        this.id = id;
        this.lecturerId = lecturerId;
        this.courseId = courseId;
        this.assignedBy = assignedBy;
        this.status = status;
        this.score = score;
        this.overrideReason = overrideReason;
        this.assignedAt = assignedAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    approve() {
        this.status = enums_1.AllocationStatus.APPROVED;
        this.updatedAt = new Date();
    }
    reject(reason) {
        this.status = enums_1.AllocationStatus.REJECTED;
        this.overrideReason = reason;
        this.updatedAt = new Date();
    }
    autoAllocate(score) {
        this.status = enums_1.AllocationStatus.AUTO_ALLOCATED;
        this.score = score;
        this.updatedAt = new Date();
    }
    createOverride(action, reason, actedBy) {
        this.status = enums_1.AllocationStatus.OVERRIDDEN;
        this.overrideReason = reason;
        this.updatedAt = new Date();
        return {
            id: 0,
            allocationId: this.id,
            actionType: action,
            reason,
            actedBy,
            timestamp: new Date()
        };
    }
    isValid() {
        return this.lecturerId > 0 && this.courseId > 0 && this.assignedBy.length > 0;
    }
}
exports.Allocation = Allocation;
//# sourceMappingURL=Allocation.js.map