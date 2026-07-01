'use client';

import React, { useState } from 'react';
import Layout from '@/components/common/Layout/Layout';
import { useRouter } from 'next/navigation';

export default function AutoAllocationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const handleAutoAllocate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/allocations/auto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedBy: 'Admin' }),
      });
      const data = await response.json();
      if (data.success) {
        setResult(data.data);
        setTimeout(() => router.push('/allocations'), 2000);
      } else {
        setError(data.error || 'Auto allocation failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Auto Allocation</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The system will automatically allocate all unallocated courses to the best lecturers based on:
        </p>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-6 space-y-1">
          <li>Specialization match</li>
          <li>Experience level</li>
          <li>Workload balance</li>
          <li>Teaching style compatibility</li>
        </ul>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {result && (
          <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-4 rounded-lg mb-6">
            <p className="font-semibold">✅ Auto allocation completed!</p>
            <p className="text-sm mt-1">Created {result.length} allocations. Redirecting...</p>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <button
            onClick={handleAutoAllocate}
            disabled={loading}
            className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 text-lg font-semibold"
          >
            {loading ? 'Running allocation...' : '🚀 Run Auto Allocation'}
          </button>
        </div>
      </div>
    </Layout>
  );
}