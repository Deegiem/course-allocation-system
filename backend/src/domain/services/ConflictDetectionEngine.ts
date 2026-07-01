import { Allocation, Course, Lecturer } from '../entities';
import { AllocationStatus } from '../enums';

export interface IConflict {
  type: 'WORKLOAD_OVERFLOW' | 'DUPLICATE_ALLOCATION' | 'SPECIALIZATION_MISMATCH' | 'INACTIVE_LECTURER' | 'INACTIVE_COURSE';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  message: string;
  lecturerId?: number;
  courseId?: number;
  allocationId?: number;
}

export class ConflictDetectionEngine {
  detectConflicts(
    lecturer: Lecturer,
    course: Course,
    existingAllocations: Allocation[],
    currentWorkload: number
  ): IConflict[] {
    const conflicts: IConflict[] = [];

    if (!lecturer.isActive) {
      conflicts.push({
        type: 'INACTIVE_LECTURER',
        severity: 'CRITICAL',
        message: `Lecturer ${lecturer.name} (${lecturer.staffId}) is not active`,
        lecturerId: lecturer.id,
        courseId: course.id
      });
    }

    if (!course.status) {
      conflicts.push({
        type: 'INACTIVE_COURSE',
        severity: 'CRITICAL',
        message: `Course ${course.code} - ${course.title} is not active`,
        courseId: course.id
      });
    }

    const newWorkload = currentWorkload + course.units;
    if (newWorkload > lecturer.maxHours) {
      conflicts.push({
        type: 'WORKLOAD_OVERFLOW',
        severity: 'HIGH',
        message: `Lecturer workload would exceed limit: ${newWorkload}/${lecturer.maxHours} hours`,
        lecturerId: lecturer.id,
        courseId: course.id
      });
    }

    const duplicate = existingAllocations.find(
      a => a.courseId === course.id && 
      (a.status === AllocationStatus.AUTO_ALLOCATED || 
       a.status === AllocationStatus.APPROVED || 
       a.status === AllocationStatus.OVERRIDDEN)
    );
    if (duplicate) {
      conflicts.push({
        type: 'DUPLICATE_ALLOCATION',
        severity: 'CRITICAL',
        message: `Course ${course.code} is already allocated to another lecturer`,
        courseId: course.id,
        allocationId: duplicate.id
      });
    }

    const courseSpecialization = this.getCourseSpecialization(course);
    if (courseSpecialization && !lecturer.canTeachCourse(courseSpecialization)) {
      conflicts.push({
        type: 'SPECIALIZATION_MISMATCH',
        severity: 'MEDIUM',
        message: `Lecturer does not specialize in ${courseSpecialization}`,
        lecturerId: lecturer.id,
        courseId: course.id
      });
    }

    return conflicts;
  }

  validateAllocationSession(
    allocations: Allocation[],
    lecturers: Lecturer[],
    courses: Course[]
  ): {
    isValid: boolean;
    conflicts: IConflict[];
    warnings: string[];
  } {
    const allConflicts: IConflict[] = [];
    const warnings: string[] = [];
    const lecturerMap = new Map(lecturers.map(l => [l.id, l]));
    const courseMap = new Map(courses.map(c => [c.id, c]));

    const lecturerAllocations = new Map<number, Allocation[]>();
    for (const allocation of allocations) {
      const key = allocation.lecturerId;
      if (!lecturerAllocations.has(key)) {
        lecturerAllocations.set(key, []);
      }
      lecturerAllocations.get(key)!.push(allocation);
    }

    for (const [lecturerId, allocations] of lecturerAllocations) {
      const lecturer = lecturerMap.get(lecturerId);
      if (!lecturer) {
        allConflicts.push({
          type: 'INACTIVE_LECTURER',
          severity: 'CRITICAL',
          message: `Lecturer ID ${lecturerId} not found`,
          lecturerId: lecturerId
        });
        continue;
      }

      let totalWorkload = 0;
      for (const allocation of allocations) {
        const course = courseMap.get(allocation.courseId);
        if (course) {
          totalWorkload += course.units;
        }
      }

      if (totalWorkload > lecturer.maxHours) {
        allConflicts.push({
          type: 'WORKLOAD_OVERFLOW',
          severity: 'HIGH',
          message: `Lecturer ${lecturer.name} overloaded: ${totalWorkload}/${lecturer.maxHours} hours`,
          lecturerId: lecturerId
        });
      }

      const courseIds = new Set<number>();
      for (const allocation of allocations) {
        if (courseIds.has(allocation.courseId)) {
          allConflicts.push({
            type: 'DUPLICATE_ALLOCATION',
            severity: 'CRITICAL',
            message: `Duplicate allocation found for lecturer ${lecturer.name}`,
            lecturerId: lecturerId,
            courseId: allocation.courseId,
            allocationId: allocation.id
          });
        }
        courseIds.add(allocation.courseId);
      }
    }

    for (const course of courses) {
      if (course.status) {
        const isAllocated = allocations.some(a => a.courseId === course.id);
        if (!isAllocated) {
          warnings.push(`Course ${course.code} - ${course.title} is unallocated`);
        }
      }
    }

    return {
      isValid: allConflicts.length === 0,
      conflicts: allConflicts,
      warnings
    };
  }

  private getCourseSpecialization(course: Course): string {
    if (course.code.includes('CSC')) return 'Computer Science';
    if (course.code.includes('MTH')) return 'Mathematics';
    if (course.code.includes('PHY')) return 'Physics';
    if (course.code.includes('STA')) return 'Statistics';
    if (course.code.includes('ENG')) return 'Engineering';
    if (course.code.includes('BIO')) return 'Biology';
    if (course.code.includes('CHE')) return 'Chemistry';
    return 'General';
  }

  generateConflictReport(conflicts: IConflict[]): string {
    if (conflicts.length === 0) {
      return '✅ No conflicts detected. All allocations are valid.';
    }

    let report = '⚠️ CONFLICT DETECTION REPORT\n';
    report += '='.repeat(50) + '\n\n';

    const critical = conflicts.filter(c => c.severity === 'CRITICAL');
    const high = conflicts.filter(c => c.severity === 'HIGH');
    const medium = conflicts.filter(c => c.severity === 'MEDIUM');
    const low = conflicts.filter(c => c.severity === 'LOW');

    if (critical.length > 0) {
      report += `🔴 CRITICAL CONFLICTS (${critical.length}):\n`;
      for (const conflict of critical) {
        report += `  - ${conflict.message}\n`;
      }
      report += '\n';
    }

    if (high.length > 0) {
      report += `🟠 HIGH SEVERITY (${high.length}):\n`;
      for (const conflict of high) {
        report += `  - ${conflict.message}\n`;
      }
      report += '\n';
    }

    if (medium.length > 0) {
      report += `🟡 MEDIUM SEVERITY (${medium.length}):\n`;
      for (const conflict of medium) {
        report += `  - ${conflict.message}\n`;
      }
      report += '\n';
    }

    if (low.length > 0) {
      report += `🟢 LOW SEVERITY (${low.length}):\n`;
      for (const conflict of low) {
        report += `  - ${conflict.message}\n`;
      }
      report += '\n';
    }

    report += `\n📊 Summary: ${conflicts.length} conflicts detected (${critical.length} critical, ${high.length} high, ${medium.length} medium, ${low.length} low)`;
    return report;
  }
}