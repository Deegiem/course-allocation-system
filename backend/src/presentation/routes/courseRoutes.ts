import { Router } from 'express';
import { CourseController } from '../controllers/CourseController';
import { CourseService } from '../../application/services/CourseService';
import { CourseRepository } from '../../infrastructure/repositories/CourseRepository';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

const courseRepository = new CourseRepository(prisma);
const courseService = new CourseService(courseRepository);
const courseController = new CourseController(courseService);

router.get('/', courseController.getAll.bind(courseController));
router.get('/active', courseController.getActive.bind(courseController));
router.get('/level/:level', courseController.getByLevel.bind(courseController));
router.get('/unallocated', courseController.getUnallocated.bind(courseController));
router.get('/:id', courseController.getById.bind(courseController));
router.post('/', courseController.create.bind(courseController));
router.put('/:id', courseController.update.bind(courseController));
router.delete('/:id', courseController.delete.bind(courseController));

export default router;