// src/lib/api/report.ts
import { api } from './client';

export interface Report {
  id: number;
  generatedBy: string;
  generatedAt: string;
  reportType: string;
  data: string;
  filePath: string | null;
}

export interface LecturerReport {
  lecturerId: number;
  lecturerName: string;
  lecturerStaffId: string;
  reportId: number;
}

export interface LecturerReportsResponse {
  totalLecturers: number;
  reports: LecturerReport[];
}

export const reportApi = {
  // Generate allocation report
  async generateAllocationReport(lecturerId?: number): Promise<Report> {
    const response = await api.post<Report>('/reports/allocation', { lecturerId });
    if (!response.success) {
      throw new Error(response.error || 'Failed to generate allocation report');
    }
    return response.data!;
  },

  // Generate workload summary
  async generateWorkloadSummary(): Promise<Report> {
    const response = await api.post<Report>('/reports/workload-summary', {});
    if (!response.success) {
      throw new Error(response.error || 'Failed to generate workload summary');
    }
    return response.data!;
  },

  // Generate level-based list
  async generateLevelBasedList(level: number): Promise<Report> {
    const response = await api.post<Report>('/reports/level-based-list', { level });
    if (!response.success) {
      throw new Error(response.error || 'Failed to generate level-based list');
    }
    return response.data!;
  },

  // ✅ Generate report for a single lecturer
  async generateLecturerReport(lecturerId: number): Promise<Report> {
    const response = await api.post<Report>(`/reports/lecturer/${lecturerId}/generate`, {});
    if (!response.success) {
      throw new Error(response.error || 'Failed to generate lecturer report');
    }
    return response.data!;
  },

  // ✅ Generate reports for ALL lecturers
  async generateAllLecturerReports(): Promise<LecturerReportsResponse> {
    const response = await api.post<LecturerReportsResponse>('/reports/lecturers/generate-all', {});
    if (!response.success) {
      throw new Error(response.error || 'Failed to generate lecturer reports');
    }
    return response.data!;
  },

  // Get all reports
  async getAll(): Promise<Report[]> {
    const response = await api.get<Report[]>('/reports');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch reports');
    }
    return response.data || [];
  },

  // Get report by ID
  async getById(id: number): Promise<Report> {
    const response = await api.get<Report>(`/reports/${id}`);
    if (!response.success) {
      throw new Error(response.error || 'Report not found');
    }
    return response.data!;
  },

  // Export report to PDF - returns the URL to download
  getExportUrl(reportId: number): string {
    return `/api/reports/${reportId}/export`;
  },

  // Download report as PDF (opens in new tab)
  downloadReport(reportId: number): void {
    window.open(`/api/reports/${reportId}/export`, '_blank');
  },
};