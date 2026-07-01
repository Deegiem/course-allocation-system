'use client';

import React, { useState } from 'react';
import Layout from '@/components/common/Layout/Layout';
import { useRouter } from 'next/navigation';
import { formatEnum } from '@/lib/format';

const RANK_OPTIONS = [
  'PROFESSOR',
  'READER',
  'SENIOR_LECTURER',
  'LECTURER_I',
  'LECTURER_II',
  'ASSISTANT_LECTURER',
  'GRADUATE_ASSISTANT',
  'ADJUNCT_LECTURER',
  'VISITING_LECTURER',
];

const TEACHING_STYLE_OPTIONS = [
  'LECTURE_BASED',
  'PRACTICAL_BASED',
  'MIXED_METHOD',
  'RESEARCH_ORIENTED',
  'STUDENT_CENTRIC',
];

export default function CreateLecturerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    staffId: '',
    name: '',
    email: '',
    rank: 'Lecturer I',
    specialization: '',
    teachingStyle: 'MIXED_METHOD',
    yearsOfExperience: 0,
    maxHours: 18,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/lecturers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          specialization: formData.specialization.split(',').map(s => s.trim()),
          yearsOfExperience: Number(formData.yearsOfExperience),
          maxHours: Number(formData.maxHours),
        }),
      });
      const result = await response.json();
      if (result.success) {
        router.push('/lecturers');
      } else {
        setError(result.error || 'Failed to create lecturer');
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Add Lecturer</h1>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Staff ID <span className="text-red-500">*</span></label>
            <input
              type="text"
              required
              value={formData.staffId}
              onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md  dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md  dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email <span className="text-red-500">*</span></label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md  dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rank <span className="text-red-500">*</span></label>
            <select
              required
              value={formData.rank}
              onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md  dark:bg-gray-700 dark:text-white"
            >
              {RANK_OPTIONS.map((rank) => (
                <option key={rank} value={rank}>{formatEnum(rank)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Specialization (comma-separated) <span className="text-red-500">*</span></label>
            <input
              type="text"
              required
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              placeholder="Computer Science, Data Science, AI"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md  dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Teaching Style <span className="text-red-500">*</span></label>
            <select
              required
              value={formData.teachingStyle}
              onChange={(e) => setFormData({ ...formData, teachingStyle: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md  dark:bg-gray-700 dark:text-white"
            >
              {TEACHING_STYLE_OPTIONS.map((style) => (
                <option key={style} value={style}>{formatEnum(style)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Years of Experience <span className="text-red-500">*</span></label>
            <input
              type="number"
              required
              min="0"
              value={formData.yearsOfExperience}
              onChange={(e) => setFormData({ ...formData, yearsOfExperience: Number(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md  dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Max Hours Per Week</label>
            <input
              type="number"
              min="1"
              max="30"
              value={formData.maxHours}
              onChange={(e) => setFormData({ ...formData, maxHours: Number(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md  dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Lecturer'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/lecturers')}
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