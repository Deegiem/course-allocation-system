'use client';

import { useState } from 'react';
import AllocationRow from './AllocationRow';
import AllocationEmptyState from './AllocationEmptyState';
import OverrideModal from './OverrideModal';

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

interface AllocationListProps {
  allocations: Allocation[];
  lecturers: Record<number, string>;
  courses: Record<number, string>;
  onRefresh: () => Promise<void>;
}

export default function AllocationList({
  allocations,
  lecturers,
  courses,
  onRefresh,
}: AllocationListProps) {
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [selectedAllocation, setSelectedAllocation] = useState<Allocation | null>(null);

  const handleApprove = async (id: number) => {
    try {
      const response = await fetch(`/api/allocations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve', approvedBy: 'Admin' }),
      });
      const result = await response.json();
      if (result.success) {
        await onRefresh();
      } else {
        alert(result.error || 'Failed to approve');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  const handleReject = async (id: number, reason: string) => {
    try {
      const response = await fetch(`/api/allocations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject', reason, rejectedBy: 'Admin' }),
      });
      const result = await response.json();
      if (result.success) {
        await onRefresh();
      } else {
        alert(result.error || 'Failed to reject');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  const handleOverrideClick = (allocation: Allocation) => {
    setSelectedAllocation(allocation);
    setShowOverrideModal(true);
  };

  const handleOverrideSubmit = async (data: { action: string; reason: string; newLecturerId: number }) => {
    if (!selectedAllocation) return;

    try {
      const response = await fetch(`/api/allocations/${selectedAllocation.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: data.action,
          reason: data.reason,
          actedBy: 'Admin',
          newLecturerId: data.newLecturerId
        }),
      });
      const result = await response.json();
      if (result.success) {
        await onRefresh();
        setShowOverrideModal(false);
        setSelectedAllocation(null);
      } else {
        alert(result.error || 'Failed to override');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  if (allocations.length === 0) {
    return <AllocationEmptyState />;
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Lecturer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Course</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Assigned By</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {allocations.map((allocation) => {
              // Get lecturer name from map or fallback
              const lecturerName = lecturers[allocation.lecturerId] || `Lecturer ${allocation.lecturerId}`;
              // Get course name from map or fallback
              const courseName = courses[allocation.courseId] || `Course ${allocation.courseId}`;

              return (
                <tr key={allocation.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    #{allocation.id}
                  </td>

                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {allocation.lecturer?.name || lecturerName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {allocation.lecturer?.staffId || ''}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">
                      {allocation.course?.code || courseName.split(' - ')[0] || ''}
                    </div>
                    <div className="text-sm text-gray-500">
                      {allocation.course?.title || courseName || ''}
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

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap ${allocation.status === 'APPROVED' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                        allocation.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          allocation.status === 'REJECTED' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                            allocation.status === 'AUTO_ALLOCATED' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                              allocation.status === 'OVERRIDDEN' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
                                'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                      }`}>
                      <span className="mr-1.5 h-2 w-2 rounded-full bg-current opacity-70" />
                      {allocation.status === 'AUTO_ALLOCATED' ? 'Auto Allocated' :
                        allocation.status === 'OVERRIDDEN' ? 'Overridden' :
                          allocation.status.charAt(0) + allocation.status.slice(1).toLowerCase()}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      {allocation.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleApprove(allocation.id)}
                            className="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                            title="Approve"
                            aria-label="Approve allocation"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>

                          <button
                            onClick={() => {
                              const reason = prompt('Enter rejection reason:');
                              if (reason) handleReject(allocation.id, reason);
                            }}
                            className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                            title="Reject"
                            aria-label="Reject allocation"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => handleOverrideClick(allocation)}
                        className="p-1 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
                        title="Override"
                        aria-label="Override allocation"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="text-sm text-green-700 dark:text-green-400 mt-2 p-6">
        Total: {allocations.length} allocations
      </div>

      {/* Override Modal */}
      {showOverrideModal && selectedAllocation && (
        <OverrideModal
          isOpen={showOverrideModal}
          onClose={() => {
            setShowOverrideModal(false);
            setSelectedAllocation(null);
          }}
          onSubmit={handleOverrideSubmit}
          allocationId={selectedAllocation.id}
          currentLecturerId={selectedAllocation.lecturerId}
          courseId={selectedAllocation.courseId}
        />
      )}
    </>
  );
}