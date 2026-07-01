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

export const DefaultSystemPolicy: ISystemPolicy = {
  maxWeeklyHours: 18,
  allowOverride: true,
  specializationStrictMode: true,
  autoAllocationEnabled: true,
  weights: {
    expertise: 0.40,
    experience: 0.20,
    workload: 0.25,
    preference: 0.10,
    performance: 0.05
  }
};

export class Policy implements IPolicy {
  constructor(
    public id: number,
    public key: string,
    public value: any,
    public description?: string,
    public updatedAt: Date = new Date()
  ) {}

  getTypedValue<T>(): T {
    return this.value as T;
  }

  isSystemPolicy(): boolean {
    const systemKeys = [
      'maxWeeklyHours',
      'allowOverride',
      'specializationStrictMode',
      'autoAllocationEnabled',
      'weights'
    ];
    return systemKeys.includes(this.key);
  }
}