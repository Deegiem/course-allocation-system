'use client';

import { WandSparkles, Plus, Bot } from "lucide-react";
import Link from 'next/link';

interface AllocationHeaderProps {
  error?: string | null;
}

export default function AllocationHeader({ error }: AllocationHeaderProps) {
  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="icon-tile">
            <WandSparkles
              className="h-5 w-5 text-blue-600 dark:text-blue-400"
              strokeWidth={2.2}
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Allocations
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage lecturer-course allocations and review allocation decisions.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            href="/allocations/manual"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus className="h-4 w-4" />
            Manual Allocate
          </Link>

          <Link
            href="/allocations/auto"
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            <Bot className="h-4 w-4" />
            Auto Allocate
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}
    </>
  );
}