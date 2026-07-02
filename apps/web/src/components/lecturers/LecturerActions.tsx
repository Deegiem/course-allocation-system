// src/components/lecturers/LecturerActions.tsx
'use client';

import { FileText, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { api } from '@/lib/api/client';

interface LecturerActionsProps {
  lecturerId: number;
  // lecturerName is kept for future use (tooltip, logging, etc.)
  lecturerName?: string; // Made optional to avoid the warning
}

export function LecturerActions({ lecturerId, lecturerName }: LecturerActionsProps) {
  const [generating, setGenerating] = useState(false);

  const generateReport = async () => {
    setGenerating(true);
    try {
      const result = await api.post<{ id: number }>(`/reports/lecturer/${lecturerId}/generate`, {});
      
      if (result.success && result.data) {
        // Open the PDF download in a new tab
        window.open(`/api/reports/${result.data.id}/export`, '_blank');
      } else {
        alert(result.error || 'Failed to generate report');
      }
    } catch (error) {
      alert('Network error');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <button
      onClick={generateReport}
      disabled={generating}
      className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm font-medium text-blue-600 transition-all hover:bg-blue-50 hover:border-blue-300 dark:border-blue-800 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-blue-900/20 disabled:opacity-50"
    >
      {generating ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <FileText className="h-4 w-4" />
      )}
      {generating ? 'Generating...' : 'Generate Allocation Report'}
    </button>
  );
}