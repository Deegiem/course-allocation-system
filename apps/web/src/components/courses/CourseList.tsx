'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Course } from '@/types';
import { Eye, Trash2 } from "lucide-react";

interface CourseListProps {
  filter?: 'all' | 'allocated' | 'unallocated';
}

export default function CourseList({ filter = 'all' }: CourseListProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allocationStatus, setAllocationStatus] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const isMounted = true;

    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/courses');
        const result = await response.json();
        if (isMounted) {
          if (result.success) {
            const courseData = result.data || [];
            setCourses(courseData);
            
            // Fetch allocation status for each course
            const statusMap: Record<number, boolean> = {};
            for (const course of courseData) {
              try {
                const allocRes = await fetch(`/api/allocations?courseId=${course.id}`);
                const allocData = await allocRes.json();
                statusMap[course.id] = allocData.success && allocData.data.length > 0;
              } catch {
                statusMap[course.id] = false;
              }
            }
            setAllocationStatus(statusMap);
          } else {
            setError(result.error || 'Failed to fetch courses');
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

    fetchCourses();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      const response = await fetch(`/api/courses/${id}`, { method: 'DELETE' });
      const result = await response.json();
      if (result.success) {
        setCourses(courses.filter(c => c.id !== id));
      } else {
        alert(result.error || 'Failed to delete');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  // Apply filter
  const getFilteredCourses = () => {
    if (filter === 'allocated') {
      return courses.filter(c => allocationStatus[c.id] === true);
    } else if (filter === 'unallocated') {
      return courses.filter(c => allocationStatus[c.id] === false);
    }
    return courses;
  };

  const filteredCourses = getFilteredCourses();

  if (loading) return <div className="text-gray-500 p-6">Loading courses...</div>;
  if (error) return <div className="text-red-500 p-6">Error: {error}</div>;

  if (filteredCourses.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-400">
        {filter === 'unallocated' 
          ? 'All courses are allocated! 🎉' 
          : filter === 'allocated'
          ? 'No allocated courses found.'
          : 'No courses found. Click "Add Course" to create one.'}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
<thead className="bg-gray-50 dark:bg-gray-900">
  <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Code</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Units</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Level</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Allocation</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {filteredCourses.map((course) => {
            const isAllocated = allocationStatus[course.id] || false;
            return (
<tr
  key={course.id}
  className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
>
<td className="px-6 py-4 whitespace-nowrap">
  <span className="rounded-md bg-gray-100 px-2 py-1 font-mono text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300">
    {course.code}
  </span>
</td>
<td className="px-6 py-4">
  <div className="font-medium text-gray-900 dark:text-white">
    {course.title}
  </div>
</td>
<td className="px-6 py-4 whitespace-nowrap">
  <span className="inline-flex rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
    {course.units} Unit{course.units > 1 ? "s" : ""}
  </span>
</td>
<td className="px-6 py-4 whitespace-nowrap">
  <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
    {course.level} Level
  </span>
</td>
<td className="px-6 py-4 whitespace-nowrap">
  <span
    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
      course.status
        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
    }`}
  >
    <span
      className={`mr-1.5 h-2 w-2 rounded-full ${
        course.status ? "bg-green-500" : "bg-red-500"
      }`}
    />
    {course.status ? "Active" : "Inactive"}
  </span>
</td>
<td className="px-6 py-4 whitespace-nowrap">
  <span
    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
      isAllocated
        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
    }`}
  >
    <span
      className={`mr-1.5 h-2 w-2 rounded-full ${
        isAllocated ? "bg-blue-500" : "bg-yellow-500"
      }`}
    />
    {isAllocated ? "Allocated" : "Unallocated"}
  </span>
</td>
<td className="px-6 py-4 whitespace-nowrap">
  <div className="flex items-center gap-2">
    <Link
      href={`/courses/${course.id}`}
      title="View course"
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-blue-600 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-blue-400 dark:hover:border-blue-700 dark:hover:bg-blue-900/20"
    >
      <Eye size={18} />
    </Link>

    <button
      onClick={() => handleDelete(course.id)}
      title="Delete course" s
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-red-600 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-gray-700 dark:bg-gray-800 dark:text-red-400 dark:hover:border-red-700 dark:hover:bg-red-900/20"
    >
      <Trash2 size={18} />
    </button>
  </div>
</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}