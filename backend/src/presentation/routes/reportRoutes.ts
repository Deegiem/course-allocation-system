import { Router } from 'express';
import { ReportController } from '../controllers/ReportController';

const router = Router();
const reportController = new ReportController();

router.post('/allocation', reportController.generateAllocationReport.bind(reportController));
router.post('/workload-summary', reportController.generateWorkloadSummary.bind(reportController));
router.post('/level-based-list', reportController.generateLevelBasedList.bind(reportController));
router.get('/', reportController.getAll.bind(reportController));
router.get('/:id', reportController.getById.bind(reportController));
// Support both GET and POST for export (GET for browser, POST for API)
router.get('/:id/export', reportController.exportToPDF.bind(reportController));
router.post('/:id/export', reportController.exportToPDF.bind(reportController));

export default router;