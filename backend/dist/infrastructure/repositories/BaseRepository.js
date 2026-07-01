"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
class BaseRepository {
    constructor(prisma, modelName) {
        this.prisma = prisma;
        this.modelName = modelName;
    }
    async findById(id) {
        const result = await this.prisma[this.modelName].findUnique({
            where: { id }
        });
        return result || null;
    }
    async findAll() {
        return await this.prisma[this.modelName].findMany();
    }
    async delete(id) {
        await this.prisma[this.modelName].delete({
            where: { id }
        });
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=BaseRepository.js.map