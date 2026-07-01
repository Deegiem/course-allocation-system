"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkloadBalancingEngine = void 0;
const enums_1 = require("../enums");
class WorkloadBalancingEngine {
    /**
     * Calculate workload distribution
     */
    calculateDistribution(lecturers, allocations, courses) {
        const distribution = [];
        const courseMap = new Map(courses.map(c => [c.id, c]));
        // Group allocations by lecturer
        const lecturerAllocations = new Map();
        for (const allocation of allocations) {
            const key = allocation.lecturerId;
            if (!lecturerAllocations.has(key)) {
                lecturerAllocations.set(key, []);
            }
            lecturerAllocations.get(key).push(allocation);
        }
        // Build distribution
        for (const lecturer of lecturers) {
            const allocs = lecturerAllocations.get(lecturer.id) || [];
            // Filter active allocations only
            const activeAllocs = allocs.filter(a => a.status === enums_1.AllocationStatus.AUTO_ALLOCATED ||
                a.status === enums_1.AllocationStatus.APPROVED ||
                a.status === enums_1.AllocationStatus.OVERRIDDEN);
            let totalLoad = 0;
            const courseDetails = [];
            for (const allocation of activeAllocs) {
                const course = courseMap.get(allocation.courseId);
                if (course) {
                    totalLoad += course.units;
                    courseDetails.push({
                        courseId: course.id,
                        code: course.code,
                        title: course.title,
                        units: course.units
                    });
                }
            }
            distribution.push({
                lecturerId: lecturer.id,
                name: lecturer.name,
                currentLoad: totalLoad,
                maxLoad: lecturer.maxHours,
                utilization: (totalLoad / lecturer.maxHours) * 100,
                courses: courseDetails
            });
        }
        return distribution;
    }
    /**
     * Analyze balance and generate recommendations
     */
    analyzeBalance(distribution) {
        const activeLecturers = distribution.filter(d => d.maxLoad > 0);
        if (activeLecturers.length === 0) {
            return {
                distribution: [],
                balanceScore: 0,
                recommendations: ['No active lecturers found'],
                overUtilized: [],
                underUtilized: []
            };
        }
        // Calculate average utilization
        const totalUtilization = activeLecturers.reduce((sum, d) => sum + d.utilization, 0);
        const averageUtilization = totalUtilization / activeLecturers.length;
        // Identify over and under utilized
        const overUtilized = activeLecturers
            .filter(d => d.utilization > 90)
            .map(d => d.lecturerId);
        const underUtilized = activeLecturers
            .filter(d => d.utilization < 30)
            .map(d => d.lecturerId);
        // Calculate balance score (lower variance = higher score)
        const variances = activeLecturers.map(d => Math.pow(d.utilization - averageUtilization, 2));
        const variance = variances.reduce((sum, v) => sum + v, 0) / variances.length;
        const maxVariance = 2500; // Max variance (100^2)
        const balanceScore = Math.max(0, 1 - (variance / maxVariance));
        // Generate recommendations
        const recommendations = [];
        if (overUtilized.length > 0) {
            const names = activeLecturers
                .filter(d => overUtilized.includes(d.lecturerId))
                .map(d => d.name)
                .join(', ');
            recommendations.push(`⚠️ Over-utilized lecturers: ${names}. Consider redistributing some courses.`);
        }
        if (underUtilized.length > 0) {
            const names = activeLecturers
                .filter(d => underUtilized.includes(d.lecturerId))
                .map(d => d.name)
                .join(', ');
            recommendations.push(`💡 Under-utilized lecturers: ${names}. Consider assigning more courses.`);
        }
        if (averageUtilization > 85) {
            recommendations.push(`⚠️ Overall utilization is high (${averageUtilization.toFixed(1)}%). Consider hiring more lecturers.`);
        }
        if (averageUtilization < 40) {
            recommendations.push(`💡 Overall utilization is low (${averageUtilization.toFixed(1)}%). Consider optimizing course allocation.`);
        }
        if (balanceScore < 0.6) {
            recommendations.push(`⚖️ Workload distribution is unbalanced. Consider using the auto-allocation feature to improve balance.`);
        }
        return {
            distribution,
            balanceScore,
            recommendations,
            overUtilized,
            underUtilized
        };
    }
    /**
     * Optimize workload distribution
     */
    optimizeDistribution(distribution, unallocatedCourses) {
        const assignments = [];
        // Sort lecturers by utilization (lowest first)
        const sortedByUtilization = [...distribution]
            .filter(d => d.maxLoad > 0)
            .sort((a, b) => a.utilization - b.utilization);
        // Find lecturers with capacity
        const availableLecturers = sortedByUtilization.filter(d => d.currentLoad < d.maxLoad);
        // Assign unallocated courses
        for (const course of unallocatedCourses) {
            // Find best lecturer (lowest utilization with capacity)
            const target = availableLecturers.find(d => d.currentLoad + course.units <= d.maxLoad);
            if (target) {
                assignments.push({
                    courseId: course.id,
                    suggestedLecturerId: target.lecturerId,
                    reason: `Balancing workload (current utilization: ${target.utilization.toFixed(1)}%)`
                });
                // Update the availability
                target.currentLoad += course.units;
                target.utilization = (target.currentLoad / target.maxLoad) * 100;
            }
        }
        // Calculate expected improvement
        const currentAvgUtilization = distribution
            .filter(d => d.maxLoad > 0)
            .reduce((sum, d) => sum + d.utilization, 0) / distribution.filter(d => d.maxLoad > 0).length;
        const improvedDistribution = distribution.map(d => {
            const matched = availableLecturers.find(a => a.lecturerId === d.lecturerId);
            return matched || d;
        });
        const newAvgUtilization = improvedDistribution
            .filter(d => d.maxLoad > 0)
            .reduce((sum, d) => sum + d.utilization, 0) / improvedDistribution.filter(d => d.maxLoad > 0).length;
        const improvement = newAvgUtilization - currentAvgUtilization;
        return {
            assignments,
            expectedImprovement: improvement
        };
    }
    /**
     * Generate workload summary report
     */
    generateWorkloadSummary(distribution) {
        let report = '📊 WORKLOAD DISTRIBUTION SUMMARY\n';
        report += '='.repeat(60) + '\n\n';
        // Sort by utilization
        const sorted = [...distribution].sort((a, b) => b.utilization - a.utilization);
        report += '| # | Lecturer | Load | Max | Utilization | Status |\n';
        report += '|---|----------|------|-----|-------------|--------|\n';
        for (let i = 0; i < sorted.length; i++) {
            const d = sorted[i];
            const status = d.utilization > 90 ? '⚠️ OVERLOADED' :
                d.utilization > 70 ? '✅ GOOD' :
                    d.utilization > 40 ? '⚠️ UNDERUTILIZED' :
                        '❌ LOW UTILIZATION';
            report += `| ${i + 1} | ${d.name.substring(0, 20)} | ${d.currentLoad} | ${d.maxLoad} | ${d.utilization.toFixed(1)}% | ${status} |\n`;
        }
        report += '\n';
        // Calculate stats
        const active = distribution.filter(d => d.maxLoad > 0);
        const avgUtilization = active.reduce((sum, d) => sum + d.utilization, 0) / active.length;
        const maxUtilization = Math.max(...active.map(d => d.utilization));
        const minUtilization = Math.min(...active.map(d => d.utilization));
        report += `📈 Statistics:\n`;
        report += `  Average Utilization: ${avgUtilization.toFixed(1)}%\n`;
        report += `  Maximum Utilization: ${maxUtilization.toFixed(1)}%\n`;
        report += `  Minimum Utilization: ${minUtilization.toFixed(1)}%\n`;
        report += `  Total Load: ${active.reduce((sum, d) => sum + d.currentLoad, 0)} hours\n`;
        report += `  Total Capacity: ${active.reduce((sum, d) => sum + d.maxLoad, 0)} hours\n`;
        return report;
    }
}
exports.WorkloadBalancingEngine = WorkloadBalancingEngine;
//# sourceMappingURL=WorkloadBalancingEngine.js.map