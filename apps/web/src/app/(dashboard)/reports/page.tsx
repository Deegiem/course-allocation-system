'use client';

import {
  FileText,
  FileSpreadsheet,
  BarChart3,
  GraduationCap,
  Download,
  Loader2,
  ClipboardList,
} from "lucide-react";
import React, { useState } from 'react';
import Layout from '@/components/common/Layout/Layout';

interface ReportType {
  value: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

const REPORT_TYPES: ReportType[] = [
  {
    value: "allocation",
    label: "Allocation Report",
    icon: <BarChart3 className="h-5 w-5" />,
    description: "Lists all course allocations with lecturer and course details",
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    value: "workload",
    label: "Workload Summary",
    icon: <FileSpreadsheet className="h-5 w-5" />,
    description: "Shows each lecturer's current workload and utilization",
    color: "text-green-600 dark:text-green-400",
  },
  {
    value: "level",
    label: "Level-Based Course List",
    icon: <GraduationCap className="h-5 w-5" />,
    description: "Lists all courses for a specific academic level with allocations",
    color: "text-purple-600 dark:text-purple-400",
  },
];

const LEVEL_OPTIONS = [100, 200, 300, 400, 500];

export default function ReportsPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [reportType, setReportType] = useState('allocation');
  const [level, setLevel] = useState('400');
  const [lastReportId, setLastReportId] = useState<number | null>(null);

  const generateReport = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let endpoint = '/api/reports';
      let body = {};

      switch (reportType) {
        case 'allocation':
          endpoint = '/api/reports/allocation';
          break;
        case 'workload':
          endpoint = '/api/reports/workload-summary';
          break;
        case 'level':
          endpoint = '/api/reports/level-based-list';
          body = { level: parseInt(level) };
          break;
        default:
          throw new Error('Invalid report type');
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      if (result.success) {
        setSuccess(`Report generated successfully!`);
        setLastReportId(result.data.id);
        setTimeout(() => {
          window.open(`/api/reports/${result.data.id}/export`, '_blank');
        }, 1000);
      } else {
        setError(result.error || 'Failed to generate report');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const selectedReport = REPORT_TYPES.find(r => r.value === reportType);

  return (
    <Layout>
      <div className="space-y-7">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="icon-tile">
              <FileText
                className="h-5 w-5 text-blue-600 dark:text-blue-400"
                strokeWidth={2.2}
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Reports
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Generate and export allocation reports, workload summaries and academic records.
              </p>
            </div>
          </div>
        </div>

        {/* Error / Success Messages */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 p-4 rounded-md">
            {success}
          </div>
        )}

        {/* Report Generation Form */}
        <div className="bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 shadow-sm p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Report Type *
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {REPORT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {reportType === 'level' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Level *
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {LEVEL_OPTIONS.map((l) => (
                  <option key={l} value={l}>
                    {l} Level
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex gap-4 pt-2">
            <button
              onClick={generateReport}
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Generate Report
                </>
              )}
            </button>
          </div>

          {lastReportId && (
            <div className="mt-4 rounded-md border border-green-200 bg-green-50 p-5 dark:border-green-800 dark:bg-green-900/20">
              <p className="text-sm text-green-700 dark:text-green-300">
                ✅ Report #{lastReportId} generated. A new tab should open with the export.
              </p>
              <button
                onClick={() => window.open(`/api/reports/${lastReportId}/export`, '_blank')}
                className="inline-flex items-center gap-2 mt-2 text-blue-600 hover:underline dark:text-blue-400"
              >
                <Download className="h-4 w-4" />
                Download Again
              </button>
            </div>
          )}
        </div>

        {/* Report Types Info */}
        <div className="bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                <ClipboardList className="inline-block h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
                 Report Types
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {REPORT_TYPES.map((type) => (
              <div
                key={type.value}
                className={`flex items-start gap-3 p-3 rounded-md border border-gray-100 dark:border-gray-700 ${
                  reportType === type.value ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800' : ''
                }`}
              >
                <span className={`${type.color} mt-0.5`}>{type.icon}</span>
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {type.label}
                  </span>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {type.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}