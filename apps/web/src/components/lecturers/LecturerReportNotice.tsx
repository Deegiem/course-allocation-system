// src/components/lecturers/LecturerReportNotice.tsx
'use client';

import { Info } from 'lucide-react';
import Link from 'next/link';

export function LecturerReportNotice() {
  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
      <div className="flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
        <div>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>HOD Note:</strong> You can generate individual allocation reports for each lecturer from their detail page.
            To generate reports for multiple lecturers, visit the{' '}
            <Link href="/reports/lecturers" className="font-medium underline hover:no-underline">
              Lecturers Reports
            </Link>{' '}
            page.
          </p>
        </div>
      </div>
    </div>
  );
}