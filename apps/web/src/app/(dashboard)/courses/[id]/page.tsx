'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/common/Layout/Layout';
import Link from 'next/link';
import { formatEnum } from '@/lib/format';

interface Course {
  id: number;
  code: string;
  title: string;
  units: number;
  level: number;
  nature: string;
  lectureHours: number;
  practicalHours: number;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Allocation {
  id: number;
  lecturerId: number;
  lecturer?: {
    id: number;
    name: string;
    staffId: string;
  };
  status: string;
  score: number | null;
}

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // ✅ Correct: Unwrap params using React.use()
  const { id } = React.use(params);
  
  const [course, setCourse] = useState<Course | null>(null);
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const [courseRes, allocRes] = await Promise.all([
          fetch(`/api/courses/${id}`),
          fetch(`/api/allocations?courseId=${id}`),
        ]);

        const courseData = await courseRes.json();
        const allocData = await allocRes.json();

        if (isMounted) {
          if (courseData.success) {
            setCourse(courseData.data);
          } else {
            setError('Course not found');
          }

          if (allocData.success) {
            // Get only the most recent active allocation
            const activeAllocs = (allocData.data || [])
              .filter((a: any) => a.status !== 'REJECTED')
              .sort((a: any, b: any) => 
                new Date(b.assignedAt).getTime() - new Date(a.assignedAt).getTime()
              );
            
            const latestAlloc = activeAllocs.length > 0 ? [activeAllocs[0]] : [];
            
            // Fetch lecturer name for the allocation
            if (latestAlloc.length > 0) {
              try {
                const lecturerRes = await fetch(`/api/lecturers/${latestAlloc[0].lecturerId}`);
                const lecturerData = await lecturerRes.json();
                if (lecturerData.success) {
                  latestAlloc[0].lecturer = lecturerData.data;
                }
              } catch {
                // Ignore lecturer fetch errors
              }
            }
            setAllocations(latestAlloc);
          }

          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError('Network error');
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      'APPROVED': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      'PENDING': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      'REJECTED': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      'AUTO_ALLOCATED': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      'OVERRIDDEN': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    };
    return styles[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
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

  if (error || !course) {
    return (
      <Layout>
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
          {error || 'Course not found'}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{course.code} - {course.title}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Course Details</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/courses"
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              ← Back
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Course Information</h3>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-gray-600 dark:text-gray-400">Course Code</dt>
                <dd className="text-gray-900 dark:text-white font-medium">{course.code}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600 dark:text-gray-400">Title</dt>
                <dd className="text-gray-900 dark:text-white font-medium">{course.title}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600 dark:text-gray-400">Units</dt>
                <dd className="text-gray-900 dark:text-white font-medium">{course.units}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600 dark:text-gray-400">Level</dt>
                <dd className="text-gray-900 dark:text-white font-medium">{course.level}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600 dark:text-gray-400">Nature</dt>
                <dd className="text-gray-900 dark:text-white font-medium">{formatEnum(course.nature)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600 dark:text-gray-400">Lecture Hours</dt>
                <dd className="text-gray-900 dark:text-white font-medium">{course.lectureHours}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600 dark:text-gray-400">Practical Hours</dt>
                <dd className="text-gray-900 dark:text-white font-medium">{course.practicalHours}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600 dark:text-gray-400">Status</dt>
                <dd>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    course.status 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {course.status ? 'Active' : 'Inactive'}
                  </span>
                </dd>
              </div>
            </dl>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Current Allocation</h3>
            {allocations.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">This course is not currently allocated.</p>
            ) : (
              allocations.map((alloc) => (
                <div key={alloc.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {alloc.lecturer?.name || `Lecturer ${alloc.lecturerId}`}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {alloc.lecturer?.staffId || ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(alloc.status)}`}>
                        {formatEnum(alloc.status)}
                      </span>
                      {alloc.score !== null && alloc.score !== undefined && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Score: {alloc.score.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}