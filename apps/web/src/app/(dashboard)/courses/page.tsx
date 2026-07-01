'use client';

import React, { useState } from 'react';
import Layout from '@/components/common/Layout/Layout';
import Link from 'next/link';
import { Plus, BookCopy } from 'lucide-react';
import CourseList from '@/components/courses/CourseList';

const filters = [
  { key: 'all', label: 'All Courses' },
  { key: 'allocated', label: 'Allocated' },
  { key: 'unallocated', label: 'Unallocated' },
] as const;

export default function CoursesPage() {
  const [filter, setFilter] = useState<'all' | 'allocated' | 'unallocated'>('all');

  return (
    <Layout>
      <div className="space-y-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="icon-tile">
              <BookCopy className="h-5 w-5 text-(--primary)" strokeWidth={2.2} />
            </div>
            <div>
              <h1 className="panel-section-title text-2xl">Courses</h1>
              <p className="text-sm text-(--text-muted) mt-1">
                Manage course records and allocation status
              </p>
            </div>
          </div>
          <Link href="/courses/create" className="dashboard-primary-btn">
            <Plus className="h-4 w-4" />
            Add Course
          </Link>
        </div>

        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className="filter-pill"
              data-active={filter === f.key}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="dashboard-card overflow-hidden">
          <CourseList filter={filter} />
        </div>
      </div>
    </Layout>
  );
}