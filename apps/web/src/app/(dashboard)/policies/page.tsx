'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/common/Layout/Layout';
import {
  Settings,
  Edit,
  Save,
  X,
  Info,
  Loader2,
  CheckCircle,
  AlertCircle,
  Clock,
  Shield,
  Users,
  Brain,
  Zap,
} from "lucide-react";

interface Policy {
  key: string;
  value: any;
  description: string;
}

const POLICY_ICONS: Record<string, React.ReactNode> = {
  maxWeeklyHours: <Clock className="h-5 w-5 text-blue-500" />,
  allowOverride: <Shield className="h-5 w-5 text-green-500" />,
  specializationStrictMode: <Users className="h-5 w-5 text-purple-500" />,
  autoAllocationEnabled: <Zap className="h-5 w-5 text-yellow-500" />,
  weights: <Brain className="h-5 w-5 text-pink-500" />,
};

const POLICY_DESCRIPTIONS: Record<string, string> = {
  maxWeeklyHours: 'Maximum weekly workload hours per lecturer',
  allowOverride: 'Allow administrators to override allocations',
  specializationStrictMode: 'Enforce specialization matching for allocations',
  autoAllocationEnabled: 'Enable automatic allocation feature',
  weights: 'Scoring weights for allocation algorithm (expertise, experience, workload, preference, performance)',
};

const POLICY_DISPLAY_NAMES: Record<string, string> = {
  maxWeeklyHours: 'Max Weekly Hours',
  allowOverride: 'Allow Override',
  specializationStrictMode: 'Specialization Strict Mode',
  autoAllocationEnabled: 'Auto Allocation Enabled',
  weights: 'Scoring Weights',
};

function formatPolicyName(key: string): string {
  return POLICY_DISPLAY_NAMES[key] || key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());
}

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  useEffect(() => {
    let isMounted = true;

    const fetchPolicies = async () => {
      try {
        const response = await fetch('/api/policies');
        const result = await response.json();
        if (isMounted) {
          if (result.success) {
            setPolicies(result.data || []);
          } else {
            setError(result.error || 'Failed to fetch policies');
          }
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError('Network error');
          setLoading(false);
        }
      }
    };

    fetchPolicies();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleEdit = (key: string, currentValue: any) => {
    setEditing(key);
    setEditValue(JSON.stringify(currentValue, null, 2));
  };

  const handleSave = async (key: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let value;
      try {
        value = JSON.parse(editValue);
      } catch {
        value = editValue;
      }

      const response = await fetch(`/api/policies/${key}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value }),
      });

      const result = await response.json();
      if (result.success) {
        setSuccess(`Policy "${formatPolicyName(key)}" updated successfully`);
        setEditing(null);
        // Refresh policies
        const refreshRes = await fetch('/api/policies');
        const refreshData = await refreshRes.json();
        if (refreshData.success) {
          setPolicies(refreshData.data || []);
        }
      } else {
        setError(result.error || 'Failed to update policy');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const getPolicyValueDisplay = (value: any): string => {
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  const getPolicyDescription = (key: string): string => {
    return POLICY_DESCRIPTIONS[key] || 'System policy';
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
            <span className="text-gray-500 dark:text-gray-400">Loading policies...</span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-7">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="icon-tile">
              <Settings
                className="h-5 w-5 text-blue-600 dark:text-blue-400"
                strokeWidth={2.2}
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                System Policies
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Configure system policies and allocation rules.
              </p>
            </div>
          </div>
        </div>

        {/* Error / Success Messages */}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-md">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 p-4 rounded-md">
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Policy Cards */}
        <div className="space-y-4">
          {policies.map((policy) => {
            const isEditing = editing === policy.key;
            const icon = POLICY_ICONS[policy.key] || <Settings className="h-5 w-5 text-gray-500" />;
            const displayName = formatPolicyName(policy.key);

            return (
              <div
                key={policy.key}
                className={`bg-white dark:bg-gray-800 rounded-xl border ${
                  isEditing ? 'border-blue-300 dark:border-blue-700 shadow-md' : 'border-gray-200 dark:border-gray-700 shadow-sm'
                } p-6 transition-all duration-200`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="mt-0.5">{icon}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {displayName}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {getPolicyDescription(policy.key)}
                      </p>
                    </div>
                  </div>

                  {!isEditing && (
                    <button
                      onClick={() => handleEdit(policy.key, policy.value)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-md hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors focus:outline-none focus:ring-offset-2"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </button>
                  )}
                </div>

                {/* Value Display */}
                {!isEditing && (
                  <div className="mt-3 bg-gray-50 dark:bg-gray-900/50 rounded-md p-3 overflow-x-auto">
                    <pre className="text-sm font-mono text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-all">
                      {getPolicyValueDisplay(policy.value)}
                    </pre>
                  </div>
                )}

                {/* Edit Mode */}
                {isEditing && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Edit Value (JSON)
                    </label>
                    <textarea
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white font-mono text-sm"
                      placeholder="Enter JSON or value..."
                    />
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleSave(policy.key)}
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                      >
                        {loading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        Save
                      </button>
                      <button
                        onClick={() => setEditing(null)}
                        className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Info Box */}
        <div className="flex items-start gap-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-5">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200">
              About Policies
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              Policies control how the allocation system behaves. Changes take effect immediately.
              The "weights" policy uses JSON format with values between 0 and 1 that sum to 1.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}