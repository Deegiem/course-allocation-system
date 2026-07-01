"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllocationStatusLabels = exports.AllocationStatus = void 0;
var AllocationStatus;
(function (AllocationStatus) {
    AllocationStatus["PENDING"] = "PENDING";
    AllocationStatus["AUTO_ALLOCATED"] = "AUTO_ALLOCATED";
    AllocationStatus["OVERRIDDEN"] = "OVERRIDDEN";
    AllocationStatus["APPROVED"] = "APPROVED";
    AllocationStatus["REJECTED"] = "REJECTED";
})(AllocationStatus || (exports.AllocationStatus = AllocationStatus = {}));
exports.AllocationStatusLabels = {
    [AllocationStatus.PENDING]: 'Pending',
    [AllocationStatus.AUTO_ALLOCATED]: 'Auto Allocated',
    [AllocationStatus.OVERRIDDEN]: 'Overridden',
    [AllocationStatus.APPROVED]: 'Approved',
    [AllocationStatus.REJECTED]: 'Rejected'
};
//# sourceMappingURL=AllocationStatus.js.map