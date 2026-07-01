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

export class Allocation implements IAllocation {
  constructor(
    public id: number,
    public lecturerId: number,
    public courseId: number,
    public assignedBy: string,
    public status: AllocationStatus = AllocationStatus.PENDING,
    public score?: number,
    public overrideReason?: string,
    public assignedAt: Date = new Date(),
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  approve(): void {
    this.status = AllocationStatus.APPROVED;
    this.updatedAt = new Date();
  }

  reject(reason: string): void {
    this.status = AllocationStatus.REJECTED;
    this.overrideReason = reason;
    this.updatedAt = new Date();
  }

  autoAllocate(score: number): void {
    this.status = AllocationStatus.AUTO_ALLOCATED;
    this.score = score;
    this.updatedAt = new Date();
  }

  createOverride(action: OverrideAction, reason: string, actedBy: string): IOverride {
    this.status = AllocationStatus.OVERRIDDEN;
    this.overrideReason = reason;
    this.updatedAt = new Date();

    return {
      id: 0,
      allocationId: this.id,
      actionType: action,
      reason,
      actedBy,
      timestamp: new Date()
    };
  }

  isValid(): boolean {
    return this.lecturerId > 0 && this.courseId > 0 && this.assignedBy.length > 0;
  }
}