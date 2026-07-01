import { PrismaClient } from '@prisma/client';
import { IRepository } from '../../domain/interfaces/IRepository';

export abstract class BaseRepository<T> implements IRepository<T> {
  constructor(
    protected prisma: PrismaClient,
    protected modelName: string
  ) {}

  abstract create(data: Partial<T>): Promise<T>;
  abstract update(id: number, data: Partial<T>): Promise<T>;
  
  async findById(id: number): Promise<T | null> {
    const result = await (this.prisma as any)[this.modelName].findUnique({
      where: { id }
    });
    return result || null;
  }

  async findAll(): Promise<T[]> {
    return await (this.prisma as any)[this.modelName].findMany();
  }

  async delete(id: number): Promise<void> {
    await (this.prisma as any)[this.modelName].delete({
      where: { id }
    });
  }
}