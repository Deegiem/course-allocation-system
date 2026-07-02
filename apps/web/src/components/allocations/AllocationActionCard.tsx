// src/components/allocations/AllocationActionCard.tsx
'use client';

import { Play, Loader2, ShieldCheck } from 'lucide-react';

interface AllocationActionCardProps {
  loading: boolean;
  onRunAllocation: () => void;
}

export function AllocationActionCard({ loading, onRunAllocation }: AllocationActionCardProps) {
  return (
    <div className="dashboard-card space-y-4 px-4 py-4">
      <div>
        <h2 className="text-lg font-semibold">Run Allocation Engine</h2>
        <p className="mt-1 text-sm text-(--text-muted)">
          The system will evaluate all eligible lecturers and unallocated courses before generating the best possible assignments.
        </p>
      </div>

      <button
        onClick={onRunAllocation}
        disabled={loading}
        className="dashboard-primary-btn w-full justify-center"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Running Allocation...
          </>
        ) : (
          <>
            <Play className="h-4 w-4" />
            Run Auto Allocation
          </>
        )}
      </button>

      {/* Info Box */}
      <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 dark:border-amber-500/20 dark:bg-amber-500/10">
        <div className="flex items-start gap-4">
          <div className="icon-tile">
            <ShieldCheck className="h-5 w-5 text-amber-600 dark:text-amber-400" strokeWidth={2.2} />
          </div>
          <div>
            <h4 className="font-medium text-amber-800 dark:text-amber-200">Before you continue</h4>
            <ul className="mt-1 space-y-1 text-sm text-amber-700 dark:text-amber-300">
              <li>• Existing approved allocations will not be modified.</li>
              <li>• Only eligible lecturers are considered.</li>
              <li>• Allocation scores are calculated automatically.</li>
              <li>• Results can be reviewed and overridden afterwards.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}