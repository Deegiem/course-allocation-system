// src/presentation/routes/reportRoutes.ts
import { Router } from 'express';
import { ReportController } from '../controllers/ReportController';

const router = Router();
const reportController = new ReportController();

// Existing routes - these are correct
router.post('/allocation', reportController.generateAllocationReport.bind(reportController));
router.post('/workload-summary', reportController.generateWorkloadSummary.bind(reportController));
router.post('/level-based-list', reportController.generateLevelBasedList.bind(reportController));
router.get('/', reportController.getAll.bind(reportController));
router.get('/:id', reportController.getById.bind(reportController));
router.get('/:id/export', reportController.exportToPDF.bind(reportController));
router.post('/:id/export', reportController.exportToPDF.bind(reportController));

// ✅ FIXED: Remove '/reports/' from these routes
// Since the router is already mounted at '/reports'
router.post('/lecturer/:id/generate', reportController.generateLecturerReport.bind(reportController));
router.post('/lecturers/generate-all', reportController.generateAllLecturerReports.bind(reportController));

export default router;