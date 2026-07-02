// src/components/allocations/AllocationCriteriaGrid.tsx
'use client';

import { BrainCircuit, GraduationCap, Scale, Sparkles } from 'lucide-react';
import { AllocationCriteriaCard } from './AllocationCriteriaCard';

const criteria = [
  {
    icon: BrainCircuit,
    title: 'Specialization Match',
    description: 'Prioritizes lecturers whose areas of specialization closely match the course requirements.',
    color: 'blue',
  },
  {
    icon: GraduationCap,
    title: 'Experience Level',
    description: 'Considers academic rank and teaching experience when evaluating lecturers.',
    color: 'green',
  },
  {
    icon: Scale,
    title: 'Workload Balance',
    description: 'Prevents lecturers from becoming overloaded while maintaining fairness.',
    color: 'yellow',
  },
  {
    icon: Sparkles,
    title: 'Teaching Compatibility',
    description: 'Gives preference to lecturers whose teaching profile best fits each course.',
    color: 'purple',
  },
];

export function AllocationCriteriaGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {criteria.map((criterion) => (
        <AllocationCriteriaCard key={criterion.title} {...criterion} />
      ))}
    </div>
  );
}