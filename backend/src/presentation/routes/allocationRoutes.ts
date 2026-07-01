import { Router } from 'express';
import { AllocationController } from '../controllers/AllocationController';
import { AllocationService } from '../../application/services/AllocationService';
import { 
  AllocationRepository,
  LecturerRepository,
  CourseRepository,
  PolicyRepository,
  AuditLogRepository
} from '../../infrastructure/repositories';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

const allocationRepository = new AllocationRepository(prisma);
const lecturerRepository = new LecturerRepository(prisma);
const courseRepository = new CourseRepository(prisma);
const policyRepository = new PolicyRepository(prisma);
const auditLogRepository = new AuditLogRepository(prisma);

const allocationService = new AllocationService(
  allocationRepository,
  lecturerRepository,
  courseRepository,
  policyRepository,
  auditLogRepository
);
const allocationController = new AllocationController(allocationService);

// Main routes
router.get('/', allocationController.getAll.bind(allocationController));
router.get('/pending', allocationController.getPending.bind(allocationController));
router.get('/workload-distribution', allocationController.getWorkloadDistribution.bind(allocationController));

// Routes with parameters (these must come AFTER the static routes)
router.get('/lecturer/:lecturerId', allocationController.getByLecturer.bind(allocationController));
router.get('/course/:courseId', allocationController.getByCourse.bind(allocationController));

// POST routes
router.post('/manual', allocationController.manualAllocate.bind(allocationController));
router.post('/auto', allocationController.autoAllocate.bind(allocationController));
router.post('/validate', allocationController.validateAllocation.bind(allocationController));

// PUT routes
router.put('/:id/approve', allocationController.approve.bind(allocationController));
router.put('/:id/reject', allocationController.reject.bind(allocationController));
router.put('/:id/override', allocationController.override.bind(allocationController));

// DELETE routes
router.delete('/:id', allocationController.delete.bind(allocationController));

export default router;