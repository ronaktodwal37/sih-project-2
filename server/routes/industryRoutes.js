import express from 'express';
import {
  getIndustries,
  getIndustry,
  createIndustry,
  updateIndustry,
  deleteIndustry,
  verifyIndustry,
} from '../controllers/industryController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { ROLES } from '../utils/constants.js';

const router = express.Router();

router.get('/', getIndustries);
router.get('/:id', getIndustry);

router.post('/', requireAuth, requireRole(ROLES.INDUSTRY, ROLES.ADMIN, ROLES.GOVERNMENT), createIndustry);
router.put('/:id', requireAuth, requireRole(ROLES.INDUSTRY, ROLES.ADMIN, ROLES.GOVERNMENT), updateIndustry);
router.delete('/:id', requireAuth, requireRole(ROLES.ADMIN), deleteIndustry);
router.patch('/:id/verify', requireAuth, requireRole(ROLES.ADMIN, ROLES.GOVERNMENT), verifyIndustry);

export default router;
