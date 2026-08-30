import express from 'express';
import {
  getUniversities,
  getUniversity,
  createUniversity,
  updateUniversity,
  deleteUniversity,
  verifyUniversity,
} from '../controllers/universityController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { ROLES } from '../utils/constants.js';

const router = express.Router();

router.get('/', getUniversities);
router.get('/:id', getUniversity);

router.post('/', requireAuth, requireRole(ROLES.UNIVERSITY, ROLES.ADMIN, ROLES.GOVERNMENT), createUniversity);
router.put('/:id', requireAuth, requireRole(ROLES.UNIVERSITY, ROLES.ADMIN, ROLES.GOVERNMENT), updateUniversity);
router.delete('/:id', requireAuth, requireRole(ROLES.ADMIN), deleteUniversity);
router.patch('/:id/verify', requireAuth, requireRole(ROLES.ADMIN, ROLES.GOVERNMENT), verifyUniversity);

export default router;
