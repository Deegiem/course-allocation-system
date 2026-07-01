"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Get all policies
router.get('/', async (_req, res) => {
    try {
        const policies = await prisma.policy.findMany();
        return res.json({ success: true, data: policies });
    }
    catch (error) {
        return res.status(500).json({ success: false, error: error.message });
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
    }
    catch (error) {
        return res.status(500).json({ success: false, error: error.message });
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
    }
    catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=policyRoutes.js.map