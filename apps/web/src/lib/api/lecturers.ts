import { api } from './client';

export interface Lecturer {
  id: number;
  staffId: string;
  name: string;
  email: string;
  rank: string;
  specialization: string;
  teachingStyle: string;
  yearsOfExperience: number;
  maxHours: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLecturerData {
  staffId: string;
  name: string;
  email: string;
  rank: string;
  specialization: string[];
  teachingStyle: string;
  yearsOfExperience: number;
  maxHours?: number;
}

export interface UpdateLecturerData extends Partial<CreateLecturerData> {
  isActive?: boolean;
}

export const lecturerApi = {
  // Get all lecturers
  async getAll(): Promise<Lecturer[]> {
    const response = await api.get<Lecturer[]>('/lecturers');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch lecturers');
    }
    return response.data || [];
  },

  // Get active lecturers
  async getActive(): Promise<Lecturer[]> {
    const response = await api.get<Lecturer[]>('/lecturers/active');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch active lecturers');
    }
    return response.data || [];
  },

  // Get lecturer by ID
  async getById(id: number): Promise<Lecturer> {
    const response = await api.get<Lecturer>(`/lecturers/${id}`);
    if (!response.success) {
      throw new Error(response.error || 'Lecturer not found');
    }
    return response.data!;
  },

  // Get lecturer by staff ID
  async getByStaffId(staffId: string): Promise<Lecturer> {
    const response = await api.get<Lecturer>(`/lecturers/staff/${staffId}`);
    if (!response.success) {
      throw new Error(response.error || 'Lecturer not found');
    }
    return response.data!;
  },

  // Create lecturer
  async create(data: CreateLecturerData): Promise<Lecturer> {
    const response = await api.post<Lecturer>('/lecturers', data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to create lecturer');
    }
    return response.data!;
  },

  // Update lecturer
  async update(id: number, data: UpdateLecturerData): Promise<Lecturer> {
    const response = await api.put<Lecturer>(`/lecturers/${id}`, data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to update lecturer');
    }
    return response.data!;
  },

  // Delete lecturer
  async delete(id: number): Promise<void> {
    const response = await api.delete<void>(`/lecturers/${id}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete lecturer');
    }
  },

  // Get lecturer workload
  async getWorkload(id: number): Promise<number> {
    const response = await api.get<number>(`/lecturers/${id}/workload`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch workload');
    }
    return response.data || 0;
  },

  // Get lecturer allocations
  async getAllocations(id: number): Promise<any[]> {
    const response = await api.get<any[]>(`/lecturers/${id}/allocations`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch allocations');
    }
    return response.data || [];
  },
};