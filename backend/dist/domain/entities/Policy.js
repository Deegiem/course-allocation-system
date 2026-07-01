"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Policy = exports.DefaultSystemPolicy = void 0;
exports.DefaultSystemPolicy = {
    maxWeeklyHours: 18,
    allowOverride: true,
    specializationStrictMode: true,
    autoAllocationEnabled: true,
    weights: {
        expertise: 0.40,
        experience: 0.20,
        workload: 0.25,
        preference: 0.10,
        performance: 0.05
    }
};
class Policy {
    constructor(id, key, value, description, updatedAt = new Date()) {
        this.id = id;
        this.key = key;
        this.value = value;
        this.description = description;
        this.updatedAt = updatedAt;
    }
    getTypedValue() {
        return this.value;
    }
    isSystemPolicy() {
        const systemKeys = [
            'maxWeeklyHours',
            'allowOverride',
            'specializationStrictMode',
            'autoAllocationEnabled',
            'weights'
        ];
        return systemKeys.includes(this.key);
    }
}
exports.Policy = Policy;
//# sourceMappingURL=Policy.js.map