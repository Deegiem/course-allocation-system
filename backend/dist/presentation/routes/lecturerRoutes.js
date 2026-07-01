"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const LecturerController_1 = require("../controllers/LecturerController");
const LecturerService_1 = require("../../application/services/LecturerService");
const LecturerRepository_1 = require("../../infrastructure/repositories/LecturerRepository");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Initialize dependencies
const lecturerRepository = new LecturerRepository_1.LecturerRepository(prisma);
const lecturerService = new LecturerService_1.LecturerService(lecturerRepository);
const lecturerController = new LecturerController_1.LecturerController(lecturerService);
// Routes - order matters! Put specific routes BEFORE generic ones
router.get('/', lecturerController.getAll.bind(lecturerController));
router.get('/active', lecturerController.getActive.bind(lecturerController));
router.get('/staff/:staffId', lecturerController.getByStaffId.bind(lecturerController));
router.get('/:id/workload', lecturerController.getWorkload.bind(lecturerController));
router.get('/:id/allocations', lecturerController.getAllocations.bind(lecturerController));
router.get('/:id', lecturerController.getById.bind(lecturerController));
router.post('/', lecturerController.create.bind(lecturerController));
router.put('/:id', lecturerController.update.bind(lecturerController));
router.delete('/:id', lecturerController.delete.bind(lecturerController));
exports.default = router;
//# sourceMappingURL=lecturerRoutes.js.map