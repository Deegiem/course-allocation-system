"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolicyRepository = void 0;
const entities_1 = require("../../domain/entities");
const BaseRepository_1 = require("./BaseRepository");
class PolicyRepository extends BaseRepository_1.BaseRepository {
    constructor(prisma) {
        super(prisma, 'policy');
    }
    async create(data) {
        const result = await this.prisma.policy.create({
            data: {
                key: data.key,
                value: data.value,
                description: data.description
            }
        });
        return this.mapToEntity(result);
    }
    async update(id, data) {
        const result = await this.prisma.policy.update({
            where: { id },
            data: {
                key: data.key,
                value: data.value,
                description: data.description
            }
        });
        return this.mapToEntity(result);
    }
    async findByKey(key) {
        const result = await this.prisma.policy.findUnique({
            where: { key }
        });
        return result ? this.mapToEntity(result) : null;
    }
    async getSystemPolicies() {
        const policies = await this.prisma.policy.findMany();
        const result = {};
        for (const policy of policies) {
            result[policy.key] = policy.value;
        }
        return result;
    }
    async updateSystemPolicy(key, value) {
        const result = await this.prisma.policy.update({
            where: { key },
            data: { value }
        });
        return this.mapToEntity(result);
    }
    mapToEntity(data) {
        return new entities_1.Policy(data.id, data.key, data.value, data.description, data.updatedAt);
    }
}
exports.PolicyRepository = PolicyRepository;
//# sourceMappingURL=PolicyRepository.js.map