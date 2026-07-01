'use client';

export default function AllocationEmptyState() {
  return (
    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
      <div className="text-4xl mb-4">📋</div>
      <p className="text-lg font-medium">No allocations found</p>
      <p className="text-sm mt-1">
        Click "Manual Allocate" or "Auto Allocate" to create your first allocation.
      </p>
    </div>
  );
}