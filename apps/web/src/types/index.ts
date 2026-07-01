// Lecturer Types
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

// Course Types
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

// Allocation Types
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
  lecturer?: Lecturer;
  course?: Course;
}

// Policy Types
export interface Policy {
  id: number;
  key: string;
  value: string;
  description: string | null;
  updatedAt: string;
}

// Report Types
export interface Report {
  id: number;
  generatedBy: string;
  generatedAt: string;
  reportType: string;
  data: string;
  filePath: string | null;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}