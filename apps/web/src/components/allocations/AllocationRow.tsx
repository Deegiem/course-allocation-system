'use client';

import { Check, X, Shuffle } from "lucide-react";
import AllocationBadge from './AllocationBadge';

interface Allocation {
  id: number;
  lecturerId: number;
  courseId: number;
  score: number | null;
  status: string;
  overrideReason: string | null;
  assignedBy: string;
  assignedAt: string;
  lecturer?: {
    id: number;
    name: string;
    staffId: string;
  };
  course?: {
    id: number;
    code: string;
    title: string;
    units: number;
  };
}

interface AllocationRowProps {
  allocation: Allocation;
  onApprove: (id: number) => void;
  onReject: (id: number, reason: string) => void;
  onOverride: (allocation: Allocation) => void;
}

export default function AllocationRow({
  allocation,
  onApprove,
  onReject,
  onOverride,
}: AllocationRowProps) {
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        #{allocation.id}
      </td>

      <td className="px-6 py-4">
        <div className="font-medium text-gray-900 dark:text-white">
          {allocation.lecturer?.name}
        </div>
        <div className="text-xs text-gray-500">
          {allocation.lecturer?.staffId}
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">
          {allocation.course?.code}
        </div>
        <div className="text-sm text-gray-500">
          {allocation.course?.title}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
        {allocation.score !== null && allocation.score !== undefined
          ? allocation.score.toFixed(2)
          : '-'}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs dark:bg-gray-700">
          {allocation.assignedBy || "System"}
        </span>
      </td>

      <td className="px-6 py-4">
        <AllocationBadge status={allocation.status} />
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <div className="flex items-center gap-2">
          {allocation.status === 'PENDING' && (
            <>
              <button
                onClick={() => onApprove(allocation.id)}
                className="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                title="Approve"
                aria-label="Approve allocation"
              >
                <Check size={18} />
              </button>

              <button
                onClick={() => {
                  const reason = prompt('Enter rejection reason:');
                  if (reason) onReject(allocation.id, reason);
                }}
                className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                title="Reject"
                aria-label="Reject allocation"
              >
                <X size={18} />
              </button>
            </>
          )}

          <button
            onClick={() => onOverride(allocation)}
            className="p-1 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
            title="Override"
            aria-label="Override allocation"
          >
            <Shuffle size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
}