"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
class BaseService {
    validateRequiredFields(data, requiredFields) {
        for (const field of requiredFields) {
            if (!data[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }
    }
    async handleError(error) {
        console.error('Service Error:', error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('An unexpected error occurred');
    }
}
exports.BaseService = BaseService;
//# sourceMappingURL=BaseService.js.map