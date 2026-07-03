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
  Check,
} from "lucide-react";

interface Policy {
  key: string;
  value: any;
  description: string;
}

interface WeightsForm {
  expertise: number;
  experience: number;
  workload: number;
  preference: number;
  performance: number;
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
  weights: 'Scoring weights for allocation algorithm',
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

function parsePolicyValue(value: any): any {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  return value;
}

function getHumanReadableValue(key: string, value: any): string {
  const parsedValue = parsePolicyValue(value);
  
  if (key === 'maxWeeklyHours') {
    return `${parsedValue} hours`;
  }
  if (key === 'allowOverride' || key === 'specializationStrictMode' || key === 'autoAllocationEnabled') {
    return parsedValue ? 'Enabled' : 'Disabled';
  }
  if (key === 'weights') {
    const w = parsedValue;
    if (typeof w === 'object' && w !== null) {
      return `Expertise: ${Math.round((w.expertise || 0) * 100)}% | Experience: ${Math.round((w.experience || 0) * 100)}% | Workload: ${Math.round((w.workload || 0) * 100)}% | Preference: ${Math.round((w.preference || 0) * 100)}% | Performance: ${Math.round((w.performance || 0) * 100)}%`;
    }
    return String(parsedValue);
  }
  return String(parsedValue);
}

function getPolicyValueDisplay(key: string, value: any): string {
  const parsedValue = parsePolicyValue(value);
  if (key === 'weights' && typeof parsedValue === 'object' && parsedValue !== null) {
    const w = parsedValue;
    return `Expertise: ${Math.round((w.expertise || 0) * 100)}%
Experience: ${Math.round((w.experience || 0) * 100)}%
Workload: ${Math.round((w.workload || 0) * 100)}%
Preference: ${Math.round((w.preference || 0) * 100)}%
Performance: ${Math.round((w.performance || 0) * 100)}%`;
  }
  return String(parsedValue);
}

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [weightsForm, setWeightsForm] = useState<WeightsForm>({
    expertise: 0.4,
    experience: 0.2,
    workload: 0.25,
    preference: 0.1,
    performance: 0.05
  });

  useEffect(() => {
    let isMounted = true;

    const fetchPolicies = async () => {
      try {
        const response = await fetch('/api/policies');
        const result = await response.json();
        if (isMounted) {
          if (result.success) {
            setPolicies(result.data || []);
            const weightsPolicy = result.data.find((p: Policy) => p.key === 'weights');
            if (weightsPolicy) {
              const parsed = parsePolicyValue(weightsPolicy.value);
              if (typeof parsed === 'object' && parsed !== null) {
                setWeightsForm({
                  expertise: parsed.expertise || 0.4,
                  experience: parsed.experience || 0.2,
                  workload: parsed.workload || 0.25,
                  preference: parsed.preference || 0.1,
                  performance: parsed.performance || 0.05
                });
              }
            }
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
  }, []);

  const handleEdit = (key: string, currentValue: any) => {
    setEditing(key);
    if (key === 'weights') {
      const parsed = parsePolicyValue(currentValue);
      if (typeof parsed === 'object' && parsed !== null) {
        setWeightsForm({
          expertise: parsed.expertise || 0.4,
          experience: parsed.experience || 0.2,
          workload: parsed.workload || 0.25,
          preference: parsed.preference || 0.1,
          performance: parsed.performance || 0.05
        });
      }
    } else {
      const parsed = parsePolicyValue(currentValue);
      setEditValue(String(parsed));
    }
  };

  const handleSaveWeights = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const total = weightsForm.expertise + weightsForm.experience + weightsForm.workload + weightsForm.preference + weightsForm.performance;
      if (Math.round(total * 100) !== 100) {
        throw new Error('Weights must sum to 100%');
      }

      const value = {
        expertise: weightsForm.expertise,
        experience: weightsForm.experience,
        workload: weightsForm.workload,
        preference: weightsForm.preference,
        performance: weightsForm.performance
      };

      const response = await fetch(`/api/policies/weights`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value }),
      });

      const result = await response.json();
      if (result.success) {
        setSuccess(`Policy "Scoring Weights" updated successfully`);
        setEditing(null);
        const refreshRes = await fetch('/api/policies');
        const refreshData = await refreshRes.json();
        if (refreshData.success) {
          setPolicies(refreshData.data || []);
        }
      } else {
        setError(result.error || 'Failed to update policy');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (key: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let value;
      const trimmedValue = editValue.trim();
      
      if (key === 'maxWeeklyHours') {
        value = parseInt(trimmedValue);
        if (isNaN(value)) throw new Error('Please enter a valid number');
      } else if (key === 'allowOverride' || key === 'specializationStrictMode' || key === 'autoAllocationEnabled') {
        value = trimmedValue === 'true';
      } else {
        value = trimmedValue;
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
        const refreshRes = await fetch('/api/policies');
        const refreshData = await refreshRes.json();
        if (refreshData.success) {
          setPolicies(refreshData.data || []);
        }
      } else {
        setError(result.error || 'Failed to update policy');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleWeightsChange = (field: keyof WeightsForm, value: string) => {
    const numValue = parseFloat(value) || 0;
    setWeightsForm(prev => ({
      ...prev,
      [field]: numValue / 100
    }));
  };

  const getWeightDisplay = (value: number): string => {
    return Math.round(value * 100).toString();
  };

  const getTotalWeight = (): number => {
    return Math.round((weightsForm.expertise + weightsForm.experience + weightsForm.workload + weightsForm.preference + weightsForm.performance) * 100);
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
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="icon-tile">
              <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400" strokeWidth={2.2} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Policies</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Configure system policies and allocation rules.</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-lg">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 p-4 rounded-lg">
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <div className="space-y-4">
          {policies.map((policy) => {
            const isEditing = editing === policy.key;
            const icon = POLICY_ICONS[policy.key] || <Settings className="h-5 w-5 text-gray-500" />;
            const displayName = formatPolicyName(policy.key);
            const humanValue = getHumanReadableValue(policy.key, policy.value);

            // Special case for weights
            if (policy.key === 'weights') {
              const totalWeight = getTotalWeight();
              const isBalanced = totalWeight === 100;

              return (
                <div key={policy.key} className={`bg-white dark:bg-gray-800 rounded-xl border ${isEditing ? 'border-blue-300 dark:border-blue-700 shadow-md' : 'border-gray-200 dark:border-gray-700 shadow-sm'} p-6 transition-all duration-200`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="mt-0.5">{icon}</div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{displayName}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{getPolicyDescription(policy.key)}</p>
                      </div>
                    </div>
                    {!isEditing && (
                      <button onClick={() => handleEdit(policy.key, policy.value)} className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors">
                        <Edit className="h-4 w-4" /> Edit
                      </button>
                    )}
                  </div>

                  {!isEditing && (
                    <div className="mt-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                      <pre className="whitespace-pre-wrap font-mono text-sm text-gray-700 dark:text-gray-300">
                        {getPolicyValueDisplay(policy.key, policy.value)}
                      </pre>
                    </div>
                  )}

                  {isEditing && (
                    <div className="mt-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expertise (%)</label>
                          <input type="number" min="0" max="100" value={getWeightDisplay(weightsForm.expertise)} onChange={(e) => handleWeightsChange('expertise', e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Experience (%)</label>
                          <input type="number" min="0" max="100" value={getWeightDisplay(weightsForm.experience)} onChange={(e) => handleWeightsChange('experience', e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Workload Balance (%)</label>
                          <input type="number" min="0" max="100" value={getWeightDisplay(weightsForm.workload)} onChange={(e) => handleWeightsChange('workload', e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preference (%)</label>
                          <input type="number" min="0" max="100" value={getWeightDisplay(weightsForm.preference)} onChange={(e) => handleWeightsChange('preference', e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Performance (%)</label>
                          <input type="number" min="0" max="100" value={getWeightDisplay(weightsForm.performance)} onChange={(e) => handleWeightsChange('performance', e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                        </div>
                        <div className="flex items-end">
                          <div className="w-full p-3 rounded-lg text-center text-sm font-medium" style={{ backgroundColor: isBalanced ? '#dcfce7' : '#fee2e2', color: isBalanced ? '#166534' : '#991b1b' }}>
                            Total: {totalWeight}% {isBalanced ? 'Balanced' : '⚠️ Must sum to 100%'}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button onClick={handleSaveWeights} disabled={loading || !isBalanced} className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50">
                          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save
                        </button>
                        <button onClick={() => setEditing(null)} className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <X className="h-4 w-4" /> Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            // Regular policy cards with select dropdowns
            return (
              <div key={policy.key} className={`bg-white dark:bg-gray-800 rounded-xl border ${isEditing ? 'border-blue-300 dark:border-blue-700 shadow-md' : 'border-gray-200 dark:border-gray-700 shadow-sm'} p-6 transition-all duration-200`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="mt-0.5">{icon}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{displayName}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{getPolicyDescription(policy.key)}</p>
                    </div>
                  </div>
                  {!isEditing && (
                    <button onClick={() => handleEdit(policy.key, policy.value)} className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors">
                      <Edit className="h-4 w-4" /> Edit
                    </button>
                  )}
                </div>

                {!isEditing && (
                  <div className="mt-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{humanValue}</p>
                  </div>
                )}

                {isEditing && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Edit Value</label>
                    {policy.key === 'maxWeeklyHours' ? (
                      <input type="number" value={editValue} onChange={(e) => setEditValue(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" placeholder="Enter hours..." />
                    ) : policy.key === 'allowOverride' || policy.key === 'specializationStrictMode' || policy.key === 'autoAllocationEnabled' ? (
                      <select value={editValue} onChange={(e) => setEditValue(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                        <option value="true">Enabled</option>
                        <option value="false">Disabled</option>
                      </select>
                    ) : (
                      <input type="text" value={editValue} onChange={(e) => setEditValue(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                    )}
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => handleSave(policy.key)} disabled={loading} className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50">
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save
                      </button>
                      <button onClick={() => setEditing(null)} className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <X className="h-4 w-4" /> Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-start gap-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-5">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200">About Policies</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              Policies control how the allocation system behaves. Changes take effect immediately.
              The "weights" policy values must sum to 100% for proper allocation scoring.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}