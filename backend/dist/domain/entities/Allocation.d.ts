import { AllocationStatus, OverrideAction } from '../enums';
export interface IAllocation {
    id: number;
    lecturerId: number;
    courseId: number;
    score?: number;
    status: AllocationStatus;
    overrideReason?: string;
    assignedBy: string;
    assignedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
export interface IOverride {
    id: number;
    allocationId: number;
    actionType: OverrideAction;
    reason: string;
    actedBy: string;
    timestamp: Date;
}
export declare class Allocation implements IAllocation {
    id: number;
    lecturerId: number;
    courseId: number;
    assignedBy: string;
    status: AllocationStatus;
    score?: number | undefined;
    overrideReason?: string | undefined;
    assignedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    constructor(id: number, lecturerId: number, courseId: number, assignedBy: string, status?: AllocationStatus, score?: number | undefined, overrideReason?: string | undefined, assignedAt?: Date, createdAt?: Date, updatedAt?: Date);
    approve(): void;
    reject(reason: string): void;
    autoAllocate(score: number): void;
    createOverride(action: OverrideAction, reason: string, actedBy: string): IOverride;
    isValid(): boolean;
}
