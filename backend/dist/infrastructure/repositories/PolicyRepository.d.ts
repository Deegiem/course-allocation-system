import { PrismaClient } from '@prisma/client';
import { IPolicyRepository } from '../../domain/interfaces/IRepository';
import { IPolicy } from '../../domain/entities';
import { BaseRepository } from './BaseRepository';
export declare class PolicyRepository extends BaseRepository<IPolicy> implements IPolicyRepository {
    constructor(prisma: PrismaClient);
    create(data: Partial<IPolicy>): Promise<IPolicy>;
    update(id: number, data: Partial<IPolicy>): Promise<IPolicy>;
    findByKey(key: string): Promise<IPolicy | null>;
    getSystemPolicies(): Promise<Record<string, any>>;
    updateSystemPolicy(key: string, value: any): Promise<IPolicy>;
    private mapToEntity;
}
