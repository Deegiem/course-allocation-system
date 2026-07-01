"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportController = void 0;
const client_1 = require("@prisma/client");
const pdfmake_1 = __importDefault(require("pdfmake"));
const prisma = new client_1.PrismaClient();
// Configure PDFMake
const fonts = {
    Roboto: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique'
    }
};
const printer = new pdfmake_1.default(fonts);
class ReportController {
    async generateAllocationReport(req, res) {
        try {
            const { lecturerId } = req.body;
            const whereClause = {};
            if (lecturerId) {
                whereClause.lecturerId = parseInt(lecturerId);
            }
            const allocations = await prisma.allocation.findMany({
                where: {
                    ...whereClause,
                    status: { in: ['AUTO_ALLOCATED', 'APPROVED', 'OVERRIDDEN'] }
                },
                include: {
                    lecturer: true,
                    course: true
                }
            });
            const reportData = {
                generatedAt: new Date().toISOString(),
                type: 'allocation',
                totalAllocations: allocations.length,
                allocations: allocations.map(a => ({
                    lecturer: a.lecturer.name,
                    lecturerStaffId: a.lecturer.staffId,
                    course: `${a.course.code} - ${a.course.title}`,
                    units: a.course.units,
                    status: a.status,
                    score: a.score
                }))
            };
            const report = await prisma.report.create({
                data: {
                    generatedBy: 'System',
                    reportType: 'ALLOCATION_REPORT',
                    data: JSON.stringify(reportData)
                }
            });
            return res.json({ success: true, data: report });
        }
        catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
    async generateWorkloadSummary(_req, res) {
        try {
            const lecturers = await prisma.lecturer.findMany({
                where: { isActive: true },
                include: {
                    allocations: {
                        where: {
                            status: { in: ['AUTO_ALLOCATED', 'APPROVED', 'OVERRIDDEN'] }
                        },
                        include: { course: true }
                    }
                }
            });
            const workloadData = lecturers.map(l => {
                const totalLoad = l.allocations.reduce((sum, a) => sum + a.course.units, 0);
                return {
                    name: l.name,
                    staffId: l.staffId,
                    rank: l.rank,
                    currentLoad: totalLoad,
                    maxLoad: l.maxHours,
                    utilization: `${Math.round((totalLoad / l.maxHours) * 100)}%`,
                    courses: l.allocations.map(a => ({
                        code: a.course.code,
                        title: a.course.title,
                        units: a.course.units
                    }))
                };
            });
            const reportData = {
                generatedAt: new Date().toISOString(),
                type: 'workload',
                totalLecturers: lecturers.length,
                summary: workloadData
            };
            const report = await prisma.report.create({
                data: {
                    generatedBy: 'System',
                    reportType: 'WORKLOAD_SUMMARY',
                    data: JSON.stringify(reportData)
                }
            });
            return res.json({ success: true, data: report });
        }
        catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
    async generateLevelBasedList(req, res) {
        try {
            const { level } = req.body;
            const courses = await prisma.course.findMany({
                where: {
                    level: parseInt(level),
                    status: true
                },
                include: {
                    allocations: {
                        where: {
                            status: { in: ['AUTO_ALLOCATED', 'APPROVED', 'OVERRIDDEN'] }
                        },
                        include: { lecturer: true }
                    }
                }
            });
            const levelData = courses.map(c => ({
                code: c.code,
                title: c.title,
                units: c.units,
                nature: c.nature,
                allocatedTo: c.allocations.length > 0 ? c.allocations[0].lecturer.name : 'Not Allocated',
                status: c.allocations.length > 0 ? 'Allocated' : 'Unallocated'
            }));
            const reportData = {
                generatedAt: new Date().toISOString(),
                type: 'level',
                level: parseInt(level),
                totalCourses: courses.length,
                allocated: levelData.filter(c => c.status === 'Allocated').length,
                unallocated: levelData.filter(c => c.status === 'Unallocated').length,
                courses: levelData
            };
            const report = await prisma.report.create({
                data: {
                    generatedBy: 'System',
                    reportType: 'LEVEL_BASED_LIST',
                    data: JSON.stringify(reportData)
                }
            });
            return res.json({ success: true, data: report });
        }
        catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
    async getAll(_req, res) {
        try {
            const reports = await prisma.report.findMany({
                orderBy: { generatedAt: 'desc' }
            });
            return res.json({ success: true, data: reports });
        }
        catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
    async getById(req, res) {
        try {
            const id = parseInt(req.params.id);
            const report = await prisma.report.findUnique({
                where: { id }
            });
            if (!report) {
                return res.status(404).json({ success: false, error: 'Report not found' });
            }
            return res.json({ success: true, data: report });
        }
        catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
    async exportToPDF(req, res) {
        try {
            const id = parseInt(req.params.id);
            const report = await prisma.report.findUnique({
                where: { id }
            });
            if (!report) {
                return res.status(404).json({ success: false, error: 'Report not found' });
            }
            // Parse the stored JSON string back to object
            const reportData = typeof report.data === 'string' ? JSON.parse(report.data) : report.data;
            // Generate PDF based on report type
            let pdfDoc;
            let filename;
            switch (report.reportType) {
                case 'ALLOCATION_REPORT':
                    pdfDoc = this.generateAllocationPDF(reportData);
                    filename = `allocation-report-${report.id}.pdf`;
                    break;
                case 'WORKLOAD_SUMMARY':
                    pdfDoc = this.generateWorkloadPDF(reportData);
                    filename = `workload-summary-${report.id}.pdf`;
                    break;
                case 'LEVEL_BASED_LIST':
                    pdfDoc = this.generateLevelPDF(reportData);
                    filename = `level-based-list-${report.id}.pdf`;
                    break;
                default:
                    throw new Error('Unknown report type');
            }
            // Generate PDF buffer
            const pdfBuffer = await new Promise((resolve) => {
                const pdfDocGenerator = printer.createPdfKitDocument(pdfDoc);
                const chunks = [];
                pdfDocGenerator.on('data', (chunk) => chunks.push(chunk));
                pdfDocGenerator.on('end', () => {
                    resolve(Buffer.concat(chunks));
                });
                pdfDocGenerator.end();
            });
            // Set response headers for PDF download
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.setHeader('Content-Length', pdfBuffer.length);
            return res.send(pdfBuffer);
        }
        catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
    generateAllocationPDF(data) {
        const tableBody = [
            ['#', 'Lecturer', 'Staff ID', 'Course', 'Units', 'Status', 'Score']
        ];
        data.allocations.forEach((a, index) => {
            tableBody.push([
                String(index + 1),
                a.lecturer,
                a.lecturerStaffId || '-',
                a.course,
                String(a.units),
                a.status,
                a.score ? a.score.toFixed(2) : '-'
            ]);
        });
        return {
            pageSize: 'A4',
            pageMargins: [40, 60, 40, 60],
            content: [
                {
                    text: 'Course Allocation Report',
                    style: 'header'
                },
                {
                    text: `Generated: ${new Date(data.generatedAt).toLocaleString()}`,
                    style: 'subheader'
                },
                {
                    text: `Total Allocations: ${data.totalAllocations}`,
                    style: 'subheader'
                },
                {
                    text: '\n',
                },
                {
                    table: {
                        headerRows: 1,
                        widths: ['auto', 'auto', 'auto', '*', 'auto', 'auto', 'auto'],
                        body: tableBody
                    },
                    style: 'table'
                },
                {
                    text: '\n\nThis report was automatically generated by the Course Allocation Management System.',
                    style: 'footer'
                }
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    alignment: 'center',
                    margin: [0, 0, 0, 10]
                },
                subheader: {
                    fontSize: 12,
                    alignment: 'center',
                    margin: [0, 0, 0, 20]
                },
                table: {
                    fontSize: 10,
                    margin: [0, 10, 0, 10]
                },
                footer: {
                    fontSize: 8,
                    alignment: 'center',
                    margin: [0, 30, 0, 0]
                }
            }
        };
    }
    generateWorkloadPDF(data) {
        const tableBody = [
            ['#', 'Lecturer', 'Staff ID', 'Rank', 'Current Load', 'Max Load', 'Utilization']
        ];
        data.summary.forEach((s, index) => {
            tableBody.push([
                String(index + 1),
                s.name,
                s.staffId,
                s.rank,
                String(s.currentLoad),
                String(s.maxLoad),
                s.utilization
            ]);
        });
        return {
            pageSize: 'A4',
            pageMargins: [40, 60, 40, 60],
            content: [
                {
                    text: 'Workload Summary Report',
                    style: 'header'
                },
                {
                    text: `Generated: ${new Date(data.generatedAt).toLocaleString()}`,
                    style: 'subheader'
                },
                {
                    text: `Total Lecturers: ${data.totalLecturers}`,
                    style: 'subheader'
                },
                {
                    text: '\n',
                },
                {
                    table: {
                        headerRows: 1,
                        widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto'],
                        body: tableBody
                    },
                    style: 'table'
                },
                {
                    text: '\n\nThis report was automatically generated by the Course Allocation Management System.',
                    style: 'footer'
                }
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    alignment: 'center',
                    margin: [0, 0, 0, 10]
                },
                subheader: {
                    fontSize: 12,
                    alignment: 'center',
                    margin: [0, 0, 0, 20]
                },
                table: {
                    fontSize: 10,
                    margin: [0, 10, 0, 10]
                },
                footer: {
                    fontSize: 8,
                    alignment: 'center',
                    margin: [0, 30, 0, 0]
                }
            }
        };
    }
    generateLevelPDF(data) {
        const tableBody = [
            ['#', 'Course Code', 'Course Title', 'Units', 'Nature', 'Allocated To', 'Status']
        ];
        data.courses.forEach((c, index) => {
            tableBody.push([
                String(index + 1),
                c.code,
                c.title,
                String(c.units),
                c.nature.replace('_', ' '),
                c.allocatedTo,
                c.status
            ]);
        });
        return {
            pageSize: 'A4',
            pageMargins: [40, 60, 40, 60],
            content: [
                {
                    text: `Level ${data.level} - Course List`,
                    style: 'header'
                },
                {
                    text: `Generated: ${new Date(data.generatedAt).toLocaleString()}`,
                    style: 'subheader'
                },
                {
                    text: `Total Courses: ${data.totalCourses} | Allocated: ${data.allocated} | Unallocated: ${data.unallocated}`,
                    style: 'subheader'
                },
                {
                    text: '\n',
                },
                {
                    table: {
                        headerRows: 1,
                        widths: ['auto', 'auto', '*', 'auto', 'auto', '*', 'auto'],
                        body: tableBody
                    },
                    style: 'table'
                },
                {
                    text: '\n\nThis report was automatically generated by the Course Allocation Management System.',
                    style: 'footer'
                }
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    alignment: 'center',
                    margin: [0, 0, 0, 10]
                },
                subheader: {
                    fontSize: 12,
                    alignment: 'center',
                    margin: [0, 0, 0, 20]
                },
                table: {
                    fontSize: 10,
                    margin: [0, 10, 0, 10]
                },
                footer: {
                    fontSize: 8,
                    alignment: 'center',
                    margin: [0, 30, 0, 0]
                }
            }
        };
    }
}
exports.ReportController = ReportController;
//# sourceMappingURL=ReportController.js.map