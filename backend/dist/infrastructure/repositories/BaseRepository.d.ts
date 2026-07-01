import { PrismaClient } from '@prisma/client';
import { IRepository } from '../../domain/interfaces/IRepository';
export declare abstract class BaseRepository<T> implements IRepository<T> {
    protected prisma: PrismaClient;
    protected modelName: string;
    constructor(prisma: PrismaClient, modelName: string);
    abstract create(data: Partial<T>): Promise<T>;
    abstract update(id: number, data: Partial<T>): Promise<T>;
    findById(id: number): Promise<T | null>;
    findAll(): Promise<T[]>;
    delete(id: number): Promise<void>;
}
