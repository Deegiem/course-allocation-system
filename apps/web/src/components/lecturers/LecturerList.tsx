'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Lecturer } from '@/types';
import { Eye, Trash2 } from 'lucide-react';
import { formatEnum } from '@/lib/format';

interface LecturerListProps {
  onDelete?: (id: number) => void;
}

export default function LecturerList({ onDelete }: LecturerListProps) {
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchLecturers = async () => {
      try {
        const response = await fetch('/api/lecturers');
        const result = await response.json();
        if (isMounted) {
          if (result.success) {
            setLecturers(result.data || []);
          } else {
            setError(result.error || 'Failed to fetch lecturers');
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

    fetchLecturers();

    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array - runs once on mount

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this lecturer?')) return;
    try {
      const response = await fetch(`/api/lecturers/${id}`, { method: 'DELETE' });
      const result = await response.json();
      if (result.success) {
        // Refresh the list after deletion
        const refreshResponse = await fetch('/api/lecturers');
        const refreshResult = await refreshResponse.json();
        if (refreshResult.success) {
          setLecturers(refreshResult.data || []);
        }
        if (onDelete) onDelete(id);
      } else {
        alert(result.error || 'Failed to delete');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  if (loading) {
    return <div className="text-gray-500 p-6">Loading lecturers...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (lecturers.length === 0) {
    return <div className="text-gray-500">No lecturers found. Click "Add Lecturer" to create one.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">          <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Staff ID</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rank</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Specialization</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
        </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {lecturers.map((lecturer) => (
            <tr
              key={lecturer.id}
              className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="rounded-md bg-gray-100 px-2 py-1 font-mono text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                  {lecturer.staffId}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium text-gray-900 dark:text-white">
                  {lecturer.name}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{formatEnum(lecturer.rank)}</td>
              <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                {Array.isArray(lecturer.specialization) ? lecturer.specialization.join(', ') : lecturer.specialization}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${lecturer.isActive
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                >
                  <span
                    className={`mr-1.5 h-2 w-2 rounded-full ${lecturer.isActive ? "bg-green-500" : "bg-red-500"
                      }`}
                  />
                  {lecturer.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/lecturers/${lecturer.id}`}
                    title="View lecturer"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-blue-600 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-blue-400 dark:hover:border-blue-700 dark:hover:bg-blue-900/20"
                  >
                    <Eye size={18} />
                  </Link>

                  <button
                    onClick={() => handleDelete(lecturer.id)}
                    title="Delete lecturer"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-red-600 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-gray-700 dark:bg-gray-800 dark:text-red-400 dark:hover:border-red-700 dark:hover:bg-red-900/20"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}