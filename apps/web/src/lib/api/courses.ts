import { api } from './client';

export interface Course {
  id: number;
  code: string;
  title: string;
  units: number;
  level: number;
  nature: string;
  lectureHours: number;
  practicalHours: number;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseData {
  code: string;
  title: string;
  units: number;
  level: number;
  nature: string;
  lectureHours: number;
  practicalHours: number;
}

export interface UpdateCourseData extends Partial<CreateCourseData> {
  status?: boolean;
}

export const courseApi = {
  // Get all courses
  async getAll(): Promise<Course[]> {
    const response = await api.get<Course[]>('/courses');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch courses');
    }
    return response.data || [];
  },

  // Get active courses
  async getActive(): Promise<Course[]> {
    const response = await api.get<Course[]>('/courses/active');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch active courses');
    }
    return response.data || [];
  },

  // Get courses by level
  async getByLevel(level: number): Promise<Course[]> {
    const response = await api.get<Course[]>(`/courses/level/${level}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch courses');
    }
    return response.data || [];
  },

  // Get unallocated courses
  async getUnallocated(): Promise<Course[]> {
    const response = await api.get<Course[]>('/courses/unallocated');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch unallocated courses');
    }
    return response.data || [];
  },

  // Get course by ID
  async getById(id: number): Promise<Course> {
    const response = await api.get<Course>(`/courses/${id}`);
    if (!response.success) {
      throw new Error(response.error || 'Course not found');
    }
    return response.data!;
  },

  // Get course by code
  async getByCode(code: string): Promise<Course> {
    const response = await api.get<Course>(`/courses/code/${code}`);
    if (!response.success) {
      throw new Error(response.error || 'Course not found');
    }
    return response.data!;
  },

  // Create course
  async create(data: CreateCourseData): Promise<Course> {
    const response = await api.post<Course>('/courses', data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to create course');
    }
    return response.data!;
  },

  // Update course
  async update(id: number, data: UpdateCourseData): Promise<Course> {
    const response = await api.put<Course>(`/courses/${id}`, data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to update course');
    }
    return response.data!;
  },

  // Delete course
  async delete(id: number): Promise<void> {
    const response = await api.delete<void>(`/courses/${id}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete course');
    }
  },

  // Get course allocations
  async getAllocations(id: number): Promise<any[]> {
    const response = await api.get<any[]>(`/courses/${id}/allocations`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch allocations');
    }
    return response.data || [];
  },
};