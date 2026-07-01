'use client';

import { formatEnum } from "@/lib/format";

interface AllocationBadgeProps {
  status: string;
}

export default function AllocationBadge({ status }: AllocationBadgeProps) {
  const getStatusStyles = (status: string): string => {
    const styles: Record<string, string> = {
      'APPROVED': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      'PENDING': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      'REJECTED': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      'AUTO_ALLOCATED': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      'OVERRIDDEN': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    };
    return styles[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
  };

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getStatusStyles(status)}`}>
      <span className="mr-1.5 h-2 w-2 rounded-full bg-current opacity-70" />
      {formatEnum(status)}
    </span>
  );
}