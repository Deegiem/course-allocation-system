import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all policies
router.get('/', async (_req, res) => {
  try {
    const policies = await prisma.policy.findMany();
    return res.json({ success: true, data: policies });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Get policy by key
router.get('/:key', async (req, res) => {
  try {
    const policy = await prisma.policy.findUnique({
      where: { key: req.params.key }
    });
    if (!policy) {
      return res.status(404).json({ success: false, error: 'Policy not found' });
    }
    return res.json({ success: true, data: policy });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Update policy
router.put('/:key', async (req, res) => {
  try {
    const { value } = req.body;
    const policy = await prisma.policy.update({
      where: { key: req.params.key },
      data: { value }
    });
    return res.json({ success: true, data: policy });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
});

export default router;