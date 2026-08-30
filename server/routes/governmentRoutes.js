import express from 'express';
import { getKPIs, getAnalytics, getDashboard } from '../controllers/governmentController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { ROLES } from '../utils/constants.js';

const router = express.Router();

router.use(requireAuth, requireRole(ROLES.GOVERNMENT, ROLES.ADMIN));

router.get('/kpis', getKPIs);
router.get('/analytics', getAnalytics);
router.get('/dashboard', getDashboard);

export default router;
