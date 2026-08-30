import express from 'express';
import {
  getUsers,
  getUser,
  updateUser,
  deactivateUser,
  activateUser,
  getAuditLogs,
  getStats,
} from '../controllers/adminController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { ROLES } from '../utils/constants.js';

const router = express.Router();

router.use(requireAuth, requireRole(ROLES.ADMIN));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.put('/users/:id', updateUser);
router.patch('/users/:id/deactivate', deactivateUser);
router.patch('/users/:id/activate', activateUser);
router.get('/audit-logs', getAuditLogs);

export default router;
