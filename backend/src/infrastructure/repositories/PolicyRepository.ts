import { PrismaClient } from '@prisma/client';
import { IPolicyRepository } from '../../domain/interfaces/IRepository';
import { Policy, IPolicy } from '../../domain/entities';
import { BaseRepository } from './BaseRepository';

export class PolicyRepository extends BaseRepository<IPolicy> implements IPolicyRepository {
  constructor(prisma: PrismaClient) {
    super(prisma, 'policy');
  }

  async create(data: Partial<IPolicy>): Promise<IPolicy> {
    const result = await this.prisma.policy.create({
      data: {
        key: data.key!,
        value: data.value!,
        description: data.description
      }
    });
    return this.mapToEntity(result);
  }

  async update(id: number, data: Partial<IPolicy>): Promise<IPolicy> {
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

  async findByKey(key: string): Promise<IPolicy | null> {
    const result = await this.prisma.policy.findUnique({
      where: { key }
    });
    return result ? this.mapToEntity(result) : null;
  }

  async getSystemPolicies(): Promise<Record<string, any>> {
    const policies = await this.prisma.policy.findMany();
    const result: Record<string, any> = {};
    for (const policy of policies) {
      result[policy.key] = policy.value;
    }
    return result;
  }

  async updateSystemPolicy(key: string, value: any): Promise<IPolicy> {
    const result = await this.prisma.policy.update({
      where: { key },
      data: { value }
    });
    return this.mapToEntity(result);
  }

  private mapToEntity(data: any): IPolicy {
    return new Policy(
      data.id,
      data.key,
      data.value,
      data.description,
      data.updatedAt
    );
  }
}