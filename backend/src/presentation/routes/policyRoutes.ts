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
    const { key } = req.params;
    let { value } = req.body;

    // Convert value to JSON string for storage
    // This handles boolean, number, object, and string values
    if (typeof value === 'boolean' || typeof value === 'number' || typeof value === 'object') {
      value = JSON.stringify(value);
    } else if (typeof value === 'string') {
      // Check if it's already a valid JSON string
      try {
        JSON.parse(value);
        // It's valid JSON, keep as is
      } catch {
        // Not valid JSON, stringify it
        value = JSON.stringify(value);
      }
    }

    const policy = await prisma.policy.update({
      where: { key },
      data: { value }
    });

    // Parse the value back for the response
    const responseData = {
      ...policy,
      value: JSON.parse(policy.value)
    };

    return res.json({ success: true, data: responseData });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
});

export default router;