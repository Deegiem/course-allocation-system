// src/components/allocations/AutoAllocationHeader.tsx
'use client';

import { Bot } from 'lucide-react';

export function AutoAllocationHeader() {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <div className="icon-tile">
          <Bot className="h-5 w-5 text-(--primary)" strokeWidth={2.2} />
        </div>

        <div>
          <div className="flex items-center gap-3">
            <h1 className="panel-section-title text-2xl">Auto Allocation</h1>
            <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold tracking-wide text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
              SMART MATCHING ENGINE
            </span>
          </div>
          <p className="mt-1 text-sm text-(--text-muted)">
            Automatically assign courses to the most suitable lecturers using the allocation engine.
          </p>
        </div>
      </div>
    </div>
  );
}