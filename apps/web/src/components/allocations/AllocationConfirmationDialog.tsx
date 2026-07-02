// src/components/allocations/AllocationConfirmationDialog.tsx
'use client';

import { AlertCircle } from 'lucide-react';

interface AllocationConfirmationDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function AllocationConfirmationDialog({
  isOpen,
  onConfirm,
  onCancel,
  loading = false,
}: AllocationConfirmationDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-800">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-amber-500/10 p-2">
            <AlertCircle className="h-6 w-6 text-amber-500" />
          </div>
          <h3 className="text-lg font-semibold">Run Auto Allocation?</h3>
        </div>
        <p className="mt-2 text-sm text-(--text-muted)">
          This operation will automatically assign all currently unallocated courses based on the matching engine.
        </p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 rounded-lg bg-(--primary) px-4 py-2 text-sm font-medium text-white hover:bg-(--primary-hover) disabled:opacity-50"
          >
            {loading ? 'Running...' : 'Run Allocation'}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-(--border) px-4 py-2 text-sm font-medium hover:bg-(--surface-secondary)"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}