'use client';

import React, { useState, useEffect } from 'react';

interface Lecturer {
  id: number;
  name: string;
  staffId: string;
}

interface OverrideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { action: string; reason: string; newLecturerId: number }) => void;
  allocationId: number;
  currentLecturerId: number;
  courseId: number;
}

export default function OverrideModal({
  isOpen,
  onClose,
  onSubmit,
  allocationId,
  currentLecturerId,
  courseId
}: OverrideModalProps) {
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    reason: '',
    newLecturerId: currentLecturerId,
  });

  useEffect(() => {
    if (isOpen) {
      fetchLecturers();
    }
  }, [isOpen]);

  const fetchLecturers = async () => {
    try {
      const response = await fetch('/api/lecturers?active=true');
      const result = await response.json();
      if (result.success) {
        // Filter out current lecturer
        const available = (result.data || []).filter((l: any) => l.id !== currentLecturerId);
        setLecturers(available);
        if (available.length > 0) {
          setFormData(prev => ({ ...prev, newLecturerId: available[0].id }));
        }
      }
    } catch (error) {
      console.error('Error fetching lecturers:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.reason.trim()) {
      alert('Please provide a reason for the override');
      return;
    }
    onSubmit({
      action: 'override',
      reason: formData.reason,
      newLecturerId: formData.newLecturerId,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Override Allocation</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
          Reassign this course to a different lecturer. The current allocation will be replaced.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Reassign To *
            </label>
            <select
              required
              value={formData.newLecturerId}
              onChange={(e) => setFormData({ ...formData, newLecturerId: Number(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            >
              {lecturers.map((lecturer) => (
                <option key={lecturer.id} value={lecturer.id}>
                  {lecturer.name} ({lecturer.staffId})
                </option>
              ))}
            </select>
            {lecturers.length === 0 && (
              <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                No other active lecturers available. The allocation will be overridden with the same lecturer.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Reason for Override *
            </label>
            <textarea
              required
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              rows={3}
              placeholder="Explain why this allocation needs to be overridden..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Confirm Override'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}