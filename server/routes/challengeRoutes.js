import express from 'express';
import {
  getChallenges,
  getChallenge,
  createChallenge,
  updateChallenge,
  deleteChallenge,
  validateChallenge,
  analyzeChallengeAI,
  assignChallenge,
  getUniversityMatches,
  getIndustryMatches,
  getMyChallenges,
} from '../controllers/challengeController.js';
import { requireAuth, requireRole, optionalAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createChallengeSchema,
  updateChallengeSchema,
  validateChallengeSchema,
  assignChallengeSchema,
} from '../validators/challengeValidator.js';
import { ROLES } from '../utils/constants.js';

const router = express.Router();

router.get('/', optionalAuth, getChallenges);
router.get('/my', requireAuth, getMyChallenges);
router.get('/:id', optionalAuth, getChallenge);
router.get('/:id/university-matches', requireAuth, requireRole(ROLES.GOVERNMENT, ROLES.ADMIN), getUniversityMatches);
router.get('/:id/industry-matches', requireAuth, requireRole(ROLES.GOVERNMENT, ROLES.ADMIN), getIndustryMatches);

router.post('/', requireAuth, validate(createChallengeSchema), createChallenge);
router.put('/:id', requireAuth, validate(updateChallengeSchema), updateChallenge);
router.delete('/:id', requireAuth, requireRole(ROLES.ADMIN, ROLES.GOVERNMENT), deleteChallenge);

router.post(
  '/:id/validate',
  requireAuth,
  requireRole(ROLES.GOVERNMENT, ROLES.ADMIN),
  validate(validateChallengeSchema),
  validateChallenge
);
router.post(
  '/:id/analyze',
  requireAuth,
  requireRole(ROLES.GOVERNMENT, ROLES.ADMIN),
  analyzeChallengeAI
);
router.post(
  '/:id/assign',
  requireAuth,
  requireRole(ROLES.GOVERNMENT, ROLES.ADMIN),
  validate(assignChallengeSchema),
  assignChallenge
);

export default router;
