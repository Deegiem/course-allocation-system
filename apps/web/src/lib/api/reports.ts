import { api } from './client';

export interface Report {
  id: number;
  generatedBy: string;
  generatedAt: string;
  reportType: string;
  data: string;
  filePath: string | null;
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

  // Export report to PDF
  async exportToPDF(reportId: number): Promise<{ filePath: string }> {
    const response = await api.post<{ filePath: string }>(`/reports/${reportId}/export`, {});
    if (!response.success) {
      throw new Error(response.error || 'Failed to export report');
    }
    return response.data!;
  },
};