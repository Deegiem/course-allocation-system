'use client';

import React from 'react';
import {
  Users,
  BookCopy,
  ClipboardCheck,
  PieChart,
  LucideIcon,
} from 'lucide-react';

type StatsCardColor = 'blue' | 'green' | 'purple' | 'orange';

interface StatsCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  icon: 'lecturers' | 'courses' | 'allocations' | 'utilization';
  color?: StatsCardColor;
}

const iconMap: Record<StatsCardProps['icon'], LucideIcon> = {
  lecturers: Users,
  courses: BookCopy,
  allocations: ClipboardCheck,
  utilization: PieChart,
};

const colorMap: Record<
  StatsCardColor,
  {
    iconWrap: string;
    iconColor: string;
    subtitle: string;
  }
> = {
  blue: {
    iconWrap: 'bg-[#253556]',
    iconColor: 'text-[#b8cbff]',
    subtitle: 'text-[#53e3a4]',
  },
  green: {
    iconWrap: 'bg-[#1f4a43]',
    iconColor: 'text-[#64f0bc]',
    subtitle: 'text-[#b8c4df]',
  },
  purple: {
    iconWrap: 'bg-[#1d4d46]',
    iconColor: 'text-[#6ef2bb]',
    subtitle: 'text-[#b8c4df]',
  },
  orange: {
    iconWrap: 'bg-[#402833]',
    iconColor: 'text-[#ff9f8e]',
    subtitle: 'text-[#b8c4df]',
  },
};

export default function StatsCard({
  title,
  value,
  subtitle,
  icon,
  color = 'blue',
}: StatsCardProps) {
  const Icon = iconMap[icon];
  const palette = colorMap[color];

  return (
    <div className="dashboard-card min-h-32 p-6">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#b9c4df]">{title}</p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-md ${palette.iconWrap}`}
        >
          <Icon className={`h-5 w-5 ${palette.iconColor}`} strokeWidth={2.2} />
        </div>
      </div>

      <div className="flex items-end gap-2">
        <h3 className="stat-value">{value}</h3>
        <p className={`pb-1 text-sm font-medium ${palette.subtitle}`}>{subtitle}</p>
      </div>
    </div>
  );
}