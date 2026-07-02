// src/components/allocations/AllocationAlert.tsx
'use client';

import { LucideIcon } from 'lucide-react';

interface AllocationAlertProps {
  type: 'error' | 'success';
  title: string;
  message: string;
  icon: LucideIcon;
}

export function AllocationAlert({ type, title, message, icon: Icon }: AllocationAlertProps) {
  const styles = {
    error: {
      border: 'border-red-200 dark:border-red-800',
      bg: 'bg-red-50 dark:bg-red-900/20',
      text: 'text-red-800 dark:text-red-200',
      subtext: 'text-red-700 dark:text-red-300',
      icon: 'text-red-600',
    },
    success: {
      border: 'border-green-200 dark:border-green-800',
      bg: 'bg-green-50 dark:bg-green-900/20',
      text: 'text-green-800 dark:text-green-200',
      subtext: 'text-green-700 dark:text-green-300',
      icon: 'text-green-600',
    },
  };

  const style = styles[type];

  return (
    <div className={`rounded-lg border ${style.border} ${style.bg} p-4`}>
      <div className="flex items-start gap-4">
        <div className="icon-tile">
          <Icon className={`h-5 w-5 ${style.icon}`} strokeWidth={2.2} />
        </div>
        <div>
          <h4 className={`font-medium ${style.text}`}>{title}</h4>
          <p className={`text-sm ${style.subtext}`}>{message}</p>
        </div>
      </div>
    </div>
  );
}