'use client';

import React, { useState } from 'react';
import Layout from '@/components/common/Layout/Layout';
import { useRouter } from 'next/navigation';
import { formatEnum } from '@/lib/format';

const NATURE_OPTIONS = [
  'THEORY_ONLY',
  'THEORY_AND_PRACTICAL',
  'PRACTICAL_ONLY',
];

export default function CreateCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    units: 3,
    level: 400,
    nature: 'THEORY_AND_PRACTICAL',
    lectureHours: 2,
    practicalHours: 2,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (result.success) {
        router.push('/courses');
      } else {
        setError(result.error || 'Failed to create course');
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Add Course</h1>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Course Code <span className="text-red-500">*</span></label>
            <input
              type="text"
              required
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              placeholder="CSC401"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Course Title <span className="text-red-500">*</span></label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Software Engineering"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Units <span className="text-red-500">*</span></label>
              <input
                type="number"
                required
                min="1"
                max="6"
                value={formData.units}
                onChange={(e) => setFormData({ ...formData, units: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Level <span className="text-red-500">*</span></label>
              <input
                type="number"
                required
                min="100"
                max="900"
                step="100"
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Course Nature <span className="text-red-500">*</span></label>
            <select
              required
              value={formData.nature}
              onChange={(e) => setFormData({ ...formData, nature: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            >
              {NATURE_OPTIONS.map((nature) => (
                <option key={nature} value={nature}>{formatEnum(nature)}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Lecture Hours</label>
              <input
                type="number"
                min="0"
                max="6"
                value={formData.lectureHours}
                onChange={(e) => setFormData({ ...formData, lectureHours: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Practical Hours</label>
              <input
                type="number"
                min="0"
                max="6"
                value={formData.practicalHours}
                onChange={(e) => setFormData({ ...formData, practicalHours: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Course'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/courses')}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}