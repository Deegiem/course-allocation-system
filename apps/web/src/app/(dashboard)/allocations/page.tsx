'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/common/Layout/Layout';
import AllocationHeader from '@/components/allocations/AllocationHeader';
import AllocationList from '@/components/allocations/AllocationList';

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

export default function AllocationsPage() {
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lecturers, setLecturers] = useState<Record<number, string>>({});
  const [courses, setCourses] = useState<Record<number, string>>({});

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [allocRes, lectRes, courseRes] = await Promise.all([
        fetch('/api/allocations'),
        fetch('/api/lecturers'),
        fetch('/api/courses'),
      ]);

      const allocData = await allocRes.json();
      const lectData = await lectRes.json();
      const courseData = await courseRes.json();

      // Build lecturer name map
      const lecturerMap: Record<number, string> = {};
      if (lectData.success) {
        lectData.data.forEach((l: any) => {
          lecturerMap[l.id] = l.name;
        });
      }
      setLecturers(lecturerMap);

      // Build course name map
      const courseMap: Record<number, string> = {};
      if (courseData.success) {
        courseData.data.forEach((c: any) => {
          courseMap[c.id] = `${c.code} - ${c.title}`;
        });
      }
      setCourses(courseMap);

      if (allocData.success) {
        // Filter to only show active allocations (not REJECTED)
        const activeAllocs = (allocData.data || []).filter(
          (a: any) => a.status !== 'REJECTED'
        );
        // Keep only the most recent allocation per course
        const courseMapFilter = new Map<number, any>();
        activeAllocs.forEach((a: any) => {
          const existing = courseMapFilter.get(a.courseId);
          if (!existing || new Date(a.assignedAt) > new Date(existing.assignedAt)) {
            courseMapFilter.set(a.courseId, a);
          }
        });
        const uniqueAllocs = Array.from(courseMapFilter.values());
        setAllocations(uniqueAllocs);
      } else {
        setError(allocData.error || 'Failed to fetch allocations');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = async () => {
    await fetchData();
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <AllocationHeader error={error} />

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <AllocationList
            allocations={allocations}
            lecturers={lecturers}
            courses={courses}
            onRefresh={handleRefresh}
          />
        </div>
      </div>
    </Layout>
  );
}