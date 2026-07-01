import { api } from './client';

export interface Policy {
  id: number;
  key: string;
  value: string;
  description: string | null;
  updatedAt: string;
}

export interface SystemPolicy {
  maxWeeklyHours: number;
  allowOverride: boolean;
  specializationStrictMode: boolean;
  autoAllocationEnabled: boolean;
  weights: {
    expertise: number;
    experience: number;
    workload: number;
    preference: number;
    performance: number;
  };
}

export const policyApi = {
  // Get all policies
  async getAll(): Promise<Policy[]> {
    const response = await api.get<Policy[]>('/policies');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch policies');
    }
    return response.data || [];
  },

  // Get policy by key
  async getByKey(key: string): Promise<Policy> {
    const response = await api.get<Policy>(`/policies/${key}`);
    if (!response.success) {
      throw new Error(response.error || 'Policy not found');
    }
    return response.data!;
  },

  // Get system policies
  async getSystem(): Promise<SystemPolicy> {
    const response = await api.get<SystemPolicy>('/policies/system');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch system policies');
    }
    return response.data!;
  },

  // Update policy
  async update(key: string, value: any): Promise<Policy> {
    const response = await api.put<Policy>(`/policies/${key}`, { value });
    if (!response.success) {
      throw new Error(response.error || 'Failed to update policy');
    }
    return response.data!;
  },

  // Update system policies
  async updateSystem(policies: Partial<SystemPolicy>): Promise<SystemPolicy> {
    const response = await api.put<SystemPolicy>('/policies/system', policies);
    if (!response.success) {
      throw new Error(response.error || 'Failed to update system policies');
    }
    return response.data!;
  },
};