// src/components/allocations/AllocationCriteriaCard.tsx
'use client';

import { LucideIcon } from 'lucide-react';

interface AllocationCriteriaCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

export function AllocationCriteriaCard({
  icon: Icon,
  title,
  description,
  color,
}: AllocationCriteriaCardProps) {
  return (
    <div className="dashboard-card px-4 py-4 transition-all duration-300 hover:-translate-y-1 hover:border-(--primary) hover:shadow-lg">
      <div className="flex items-start gap-4">
        <div className="icon-tile">
          <Icon className={`h-5 w-5 text-${color}-600`} strokeWidth={2.2} />
        </div>
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="mt-1 text-sm text-(--text-muted)">{description}</p>
        </div>
      </div>
    </div>
  );
}