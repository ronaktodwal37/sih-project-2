import express from 'express';
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addMilestone,
  updateMilestone,
  deleteMilestone,
  getMyProjects,
} from '../controllers/projectController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createProjectSchema,
  updateProjectSchema,
  createMilestoneSchema,
  updateMilestoneSchema,
} from '../validators/projectValidator.js';
import { ROLES } from '../utils/constants.js';

const router = express.Router();

router.get('/', requireAuth, getProjects);
router.get('/my', requireAuth, getMyProjects);
router.get('/:id', requireAuth, getProject);

router.post(
  '/',
  requireAuth,
  requireRole(ROLES.UNIVERSITY, ROLES.FACULTY, ROLES.GOVERNMENT, ROLES.ADMIN),
  validate(createProjectSchema),
  createProject
);
router.put(
  '/:id',
  requireAuth,
  requireRole(ROLES.UNIVERSITY, ROLES.FACULTY, ROLES.GOVERNMENT, ROLES.ADMIN),
  validate(updateProjectSchema),
  updateProject
);
router.delete('/:id', requireAuth, requireRole(ROLES.ADMIN, ROLES.GOVERNMENT), deleteProject);

router.post(
  '/:id/milestones',
  requireAuth,
  requireRole(ROLES.UNIVERSITY, ROLES.FACULTY, ROLES.GOVERNMENT, ROLES.ADMIN),
  validate(createMilestoneSchema),
  addMilestone
);
router.put(
  '/:id/milestones/:milestoneId',
  requireAuth,
  requireRole(ROLES.UNIVERSITY, ROLES.FACULTY, ROLES.GOVERNMENT, ROLES.ADMIN),
  validate(updateMilestoneSchema),
  updateMilestone
);
router.delete(
  '/:id/milestones/:milestoneId',
  requireAuth,
  requireRole(ROLES.UNIVERSITY, ROLES.FACULTY, ROLES.GOVERNMENT, ROLES.ADMIN),
  deleteMilestone
);

export default router;
