// src/app/allocations/auto/page.tsx
'use client';

import React, { useState } from 'react';
import Layout from '@/components/common/Layout/Layout';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api/client';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { AutoAllocationHeader } from '@/components/allocations/AutoAllocationHeader';
import { AllocationCriteriaGrid } from '@/components/allocations/AllocationCriteriaGrid';
import { AllocationAlert } from '@/components/allocations/AllocationAlert';
import { AllocationActionCard } from '@/components/allocations/AllocationActionCard';
import { AllocationConfirmationDialog } from '@/components/allocations/AllocationConfirmationDialog';

interface AllocationResult {
  id: number;
  lecturerId: number;
  courseId: number;
  status: string;
  score: number;
}

export default function AutoAllocationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AllocationResult[] | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleAutoAllocate = async () => {
    setShowConfirmDialog(false);
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const result = await api.post<AllocationResult[]>('/allocations/auto', {
        assignedBy: 'Admin',
      });

      if (result.success) {
        setResult(result.data || []);
        setTimeout(() => router.push('/allocations'), 2000);
      } else {
        setError(result.error || 'Auto allocation failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <AutoAllocationHeader />

        {/* Criteria Grid */}
        <AllocationCriteriaGrid />

        {/* Error Alert */}
        {error && (
          <AllocationAlert
            type="error"
            title="Error"
            message={error}
            icon={AlertCircle}
          />
        )}

        {/* Success Alert */}
        {result && (
          <AllocationAlert
            type="success"
            title="Allocation Completed"
            message={`Successfully created ${result.length} allocation(s). You will be redirected shortly.`}
            icon={CheckCircle2}
          />
        )}

        {/* Action Card */}
        <AllocationActionCard
          loading={loading}
          onRunAllocation={() => setShowConfirmDialog(true)}
        />
      </div>

      {/* Confirmation Dialog */}
      <AllocationConfirmationDialog
        isOpen={showConfirmDialog}
        onConfirm={handleAutoAllocate}
        onCancel={() => setShowConfirmDialog(false)}
        loading={loading}
      />
    </Layout>
  );
}