'use client';

import React from 'react';
import Layout from '@/components/common/Layout/Layout';
import Link from 'next/link';
import { Plus, Users } from 'lucide-react';
import LecturerList from '@/components/lecturers/LecturerList';

export default function LecturersPage() {
  return (
    <Layout>
      <div className="space-y-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="icon-tile">
              <Users className="h-5 w-5 text-(--success)" strokeWidth={2.2} />
            </div>
            <div>
              <h1 className="panel-section-title text-2xl">Lecturers</h1>
              <p className="text-sm text-(--text-muted) mt-1">
                Manage lecturer records and workload
              </p>
            </div>
          </div>
          <Link href="/lecturers/create" className="dashboard-primary-btn">
            <Plus className="h-4 w-4" />
            Add Lecturer
          </Link>
        </div>

        <div className="dashboard-card overflow-hidden">
          <LecturerList />
        </div>
      </div>
    </Layout>
  );
}