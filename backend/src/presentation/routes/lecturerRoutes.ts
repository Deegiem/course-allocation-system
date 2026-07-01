import { Router } from 'express';
import { LecturerController } from '../controllers/LecturerController';
import { LecturerService } from '../../application/services/LecturerService';
import { LecturerRepository } from '../../infrastructure/repositories/LecturerRepository';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Initialize dependencies
const lecturerRepository = new LecturerRepository(prisma);
const lecturerService = new LecturerService(lecturerRepository);
const lecturerController = new LecturerController(lecturerService);

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

export default router;