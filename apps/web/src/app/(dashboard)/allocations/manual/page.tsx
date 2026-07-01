'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/common/Layout/Layout';
import { useRouter } from 'next/navigation';

interface Lecturer {
  id: number;
  name: string;
  staffId: string;
}

interface Course {
  id: number;
  code: string;
  title: string;
  units: number;
  status: boolean;
}

export default function ManualAllocationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [formData, setFormData] = useState({
    lecturerId: '',
    courseId: '',
  });

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const [lecturersRes, coursesRes] = await Promise.all([
          fetch('/api/lecturers?active=true'),
          fetch('/api/courses'), // Get ALL courses
        ]);
        
        const lecturersData = await lecturersRes.json();
        const coursesData = await coursesRes.json();
        
        if (isMounted) {
          if (lecturersData.success) setLecturers(lecturersData.data || []);
          if (coursesData.success) {
            // Show all active courses
            const activeCourses = (coursesData.data || []).filter((c: Course) => c.status === true);
            setCourses(activeCourses);
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching data:', err);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/allocations/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lecturerId: Number(formData.lecturerId),
          courseId: Number(formData.courseId),
          assignedBy: 'Admin',
        }),
      });
      const result = await response.json();
      if (result.success) {
        setSuccess('✅ Course allocated successfully! Previous allocation was replaced.');
        setFormData({ lecturerId: '', courseId: '' });
        setTimeout(() => router.push('/allocations'), 1500);
      } else {
        setError(result.error || 'Failed to allocate course');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Manual Allocation</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Assign a course to a lecturer. This will replace any existing allocation for the selected course.
        </p>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-4 rounded-lg mb-6">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Lecturer *</label>
            <select
              required
              value={formData.lecturerId}
              onChange={(e) => setFormData({ ...formData, lecturerId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select a lecturer...</option>
              {lecturers.map((lecturer) => (
                <option key={lecturer.id} value={lecturer.id}>
                  {lecturer.name} ({lecturer.staffId})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Course *</label>
            <select
              required
              value={formData.courseId}
              onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select a course...</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.code} - {course.title} ({course.units} units)
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Allocating...' : 'Allocate Course'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/allocations')}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}