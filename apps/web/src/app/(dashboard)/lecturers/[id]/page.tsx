'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/common/Layout/Layout';
import Link from 'next/link';
import { formatEnum } from '@/lib/format';

interface Lecturer {
  id: number;
  staffId: string;
  name: string;
  email: string;
  rank: string;
  specialization: string;
  teachingStyle: string;
  yearsOfExperience: number;
  maxHours: number;
  isActive: boolean;
}

interface Allocation {
  id: number;
  courseId: number;
  course?: {
    code: string;
    title: string;
    units: number;
  };
  status: string;
  score: number | null;
}

export default function LecturerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);

  const [lecturer, setLecturer] = useState<Lecturer | null>(null);
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [workload, setWorkload] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        console.log(`Fetching data for lecturer ID: ${id}`);

        // ✅ Fetch lecturer data
        const lecturerRes = await fetch(`/api/lecturers/${id}`);
        const lecturerData = await lecturerRes.json();
        console.log('Lecturer data:', lecturerData);

        // ✅ Fetch allocations for this specific lecturer ONLY
        const allocRes = await fetch(`/api/allocations?lecturerId=${id}`);
        const allocData = await allocRes.json();
        console.log('Allocations data:', allocData);

        if (isMounted) {
          if (lecturerData.success) {
            setLecturer(lecturerData.data);
          } else {
            setError('Lecturer not found');
          }

          if (allocData.success) {
            // ✅ Filter allocations to only show this lecturer's allocations
            const lecturerAllocations = (allocData.data || []).filter(
              (a: any) => a.lecturerId === parseInt(id)
            );

            console.log(`Filtered allocations for lecturer ${id}:`, lecturerAllocations);

            // Fetch course details for each allocation
            const allocsWithCourses = await Promise.all(
              lecturerAllocations.map(async (alloc: any) => {
                if (alloc.courseId) {
                  try {
                    const courseRes = await fetch(`/api/courses/${alloc.courseId}`);
                    const courseData = await courseRes.json();
                    return {
                      ...alloc,
                      course: courseData.success ? courseData.data : null
                    };
                  } catch {
                    return alloc;
                  }
                }
                return alloc;
              })
            );

            // Show only active allocations (not rejected)
            const activeAllocs = allocsWithCourses.filter(
              (a: any) => a.status !== 'REJECTED'
            );
            setAllocations(activeAllocs);

            // ✅ Calculate workload from active allocations
            const totalWorkload = activeAllocs.reduce((sum, a) => {
              return sum + (a.course?.units || 0);
            }, 0);
            setWorkload(totalWorkload);
            console.log(`Calculated workload: ${totalWorkload} hours`);
          }

          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching lecturer data:', err);
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

  const getUtilizationColor = (utilization: number) => {
    if (utilization > 90) return 'text-red-600 dark:text-red-400';
    if (utilization > 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
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

  if (error || !lecturer) {
    return (
      <Layout>
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
          {error || 'Lecturer not found'}
        </div>
      </Layout>
    );
  }

  const utilization = lecturer.maxHours > 0 ? (workload / lecturer.maxHours) * 100 : 0;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{lecturer.name}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{lecturer.staffId} - {lecturer.rank}</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/lecturers"
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              ← Back
            </Link>
          </div>
        </div>

        {/* Lecturer Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Lecturer Information</h3>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-gray-600 dark:text-gray-400">Staff ID</dt>
                <dd className="text-gray-900 dark:text-white font-medium">{lecturer.staffId}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600 dark:text-gray-400">Email</dt>
                <dd className="text-gray-900 dark:text-white font-medium">{lecturer.email}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600 dark:text-gray-400">Rank</dt>
                <dd className="text-gray-900 dark:text-white font-medium">{formatEnum(lecturer.rank)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600 dark:text-gray-400">Specialization</dt>
                <dd className="text-gray-900 dark:text-white font-medium">{lecturer.specialization}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600 dark:text-gray-400">Teaching Style</dt>
                <dd className="text-gray-900 dark:text-white font-medium">{formatEnum(lecturer.teachingStyle)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600 dark:text-gray-400">Years of Experience</dt>
                <dd className="text-gray-900 dark:text-white font-medium">{lecturer.yearsOfExperience}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600 dark:text-gray-400">Status</dt>
                <dd>
                  <span className={`px-2 py-1 text-xs rounded-full ${lecturer.isActive
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                    {lecturer.isActive ? 'Active' : 'Inactive'}
                  </span>
                </dd>
              </div>
            </dl>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Workload Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Current Load</span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{workload} hours</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Max Capacity</span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{lecturer.maxHours} hours</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Utilization</span>
                <span className={`text-2xl font-bold ${getUtilizationColor(utilization)}`}>
                  {utilization.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${utilization > 90 ? 'bg-red-600' :
                      utilization > 70 ? 'bg-yellow-500' :
                        'bg-green-600'
                    }`}
                  style={{ width: `${Math.min(utilization, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Allocations - Only showing this lecturer's allocations */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Current Allocations</h3>
          {allocations.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No current allocations for this lecturer.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Course</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Units</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {allocations.map((alloc) => (
                    <tr key={alloc.id}>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                        {alloc.course ? `${alloc.course.code} - ${alloc.course.title}` : `Course ${alloc.courseId}`}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                        {alloc.course?.units || '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(alloc.status)}`}>
                          {formatEnum(alloc.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                        {alloc.score !== null && alloc.score !== undefined ? alloc.score.toFixed(2) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}