"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AllocationController_1 = require("../controllers/AllocationController");
const AllocationService_1 = require("../../application/services/AllocationService");
const repositories_1 = require("../../infrastructure/repositories");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
const allocationRepository = new repositories_1.AllocationRepository(prisma);
const lecturerRepository = new repositories_1.LecturerRepository(prisma);
const courseRepository = new repositories_1.CourseRepository(prisma);
const policyRepository = new repositories_1.PolicyRepository(prisma);
const auditLogRepository = new repositories_1.AuditLogRepository(prisma);
const allocationService = new AllocationService_1.AllocationService(allocationRepository, lecturerRepository, courseRepository, policyRepository, auditLogRepository);
const allocationController = new AllocationController_1.AllocationController(allocationService);
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
exports.default = router;
//# sourceMappingURL=allocationRoutes.js.map