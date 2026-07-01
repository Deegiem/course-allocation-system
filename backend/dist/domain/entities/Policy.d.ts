export interface IPolicy {
    id: number;
    key: string;
    value: any;
    description?: string;
    updatedAt: Date;
}
export interface IAllocationWeights {
    expertise: number;
    experience: number;
    workload: number;
    preference: number;
    performance: number;
}
export interface ISystemPolicy {
    maxWeeklyHours: number;
    allowOverride: boolean;
    specializationStrictMode: boolean;
    autoAllocationEnabled: boolean;
    weights: IAllocationWeights;
}
export declare const DefaultSystemPolicy: ISystemPolicy;
export declare class Policy implements IPolicy {
    id: number;
    key: string;
    value: any;
    description?: string | undefined;
    updatedAt: Date;
    constructor(id: number, key: string, value: any, description?: string | undefined, updatedAt?: Date);
    getTypedValue<T>(): T;
    isSystemPolicy(): boolean;
}
