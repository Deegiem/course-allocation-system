import { api } from './client';

export interface Allocation {
  id: number;
  lecturerId: number;
  courseId: number;
  score: number | null;
  status: string;
  overrideReason: string | null;
  assignedBy: string;
  assignedAt: string;
  createdAt: string;
  updatedAt: string;
  lecturer?: {
    id: number;
    name: string;
    staffId: string;
  };
  course?: {
    id: number;
    code: string;
    title: string;
    units: number;
  };
}

export interface CreateAllocationData {
  lecturerId: number;
  courseId: number;
  assignedBy: string;
}

export interface OverrideAllocationData {
  action: 'FORCE_ASSIGN' | 'REJECT' | 'MODIFY';
  reason: string;
  actedBy: string;
}

export const allocationApi = {
  // Get all active allocations
  async getAll(): Promise<Allocation[]> {
    const response = await api.get<Allocation[]>('/allocations');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch allocations');
    }
    return response.data || [];
  },

  // Get pending allocations
  async getPending(): Promise<Allocation[]> {
    const response = await api.get<Allocation[]>('/allocations/pending');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch pending allocations');
    }
    return response.data || [];
  },

  // Get allocations by lecturer
  async getByLecturer(lecturerId: number): Promise<Allocation[]> {
    const response = await api.get<Allocation[]>(`/allocations/lecturer/${lecturerId}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch allocations');
    }
    return response.data || [];
  },

  // Get allocations by course
  async getByCourse(courseId: number): Promise<Allocation[]> {
    const response = await api.get<Allocation[]>(`/allocations/course/${courseId}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch allocations');
    }
    return response.data || [];
  },

  // Manual allocation
  async manualAllocate(data: CreateAllocationData): Promise<Allocation> {
    const response = await api.post<Allocation>('/allocations/manual', data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to allocate course');
    }
    return response.data!;
  },

  // Auto allocation
  async autoAllocate(assignedBy: string): Promise<{ sessionId: string; allocations: Allocation[] }> {
    const response = await api.post<{ sessionId: string; allocations: Allocation[] }>(
      '/allocations/auto',
      { assignedBy }
    );
    if (!response.success) {
      throw new Error(response.error || 'Auto allocation failed');
    }
    return response.data!;
  },

  // Override allocation
  async overrideAllocation(
    allocationId: number,
    data: OverrideAllocationData
  ): Promise<Allocation> {
    const response = await api.put<Allocation>(`/allocations/${allocationId}/override`, data);
    if (!response.success) {
      throw new Error(response.error || 'Override failed');
    }
    return response.data!;
  },

  // Approve allocation
  async approve(allocationId: number, approvedBy: string): Promise<Allocation> {
    const response = await api.put<Allocation>(`/allocations/${allocationId}/approve`, {
      approvedBy,
    });
    if (!response.success) {
      throw new Error(response.error || 'Approval failed');
    }
    return response.data!;
  },

  // Reject allocation
  async reject(allocationId: number, reason: string, rejectedBy: string): Promise<Allocation> {
    const response = await api.put<Allocation>(`/allocations/${allocationId}/reject`, {
      reason,
      rejectedBy,
    });
    if (!response.success) {
      throw new Error(response.error || 'Rejection failed');
    }
    return response.data!;
  },

  // Validate allocation
  async validate(lecturerId: number, courseId: number): Promise<{
    valid: boolean;
    message?: string;
    conflicts?: string[];
  }> {
    const response = await api.post<{ valid: boolean; message?: string; conflicts?: string[] }>(
      '/allocations/validate',
      { lecturerId, courseId }
    );
    if (!response.success) {
      throw new Error(response.error || 'Validation failed');
    }
    return response.data!;
  },

  // Get workload distribution
  async getWorkloadDistribution(): Promise<{
    lecturerId: number;
    name: string;
    currentLoad: number;
    maxLoad: number;
    utilization: number;
  }[]> {
    const response = await api.get<{
      lecturerId: number;
      name: string;
      currentLoad: number;
      maxLoad: number;
      utilization: number;
    }[]>('/allocations/workload-distribution');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch workload distribution');
    }
    return response.data || [];
  },
};