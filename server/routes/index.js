import express from 'express';
import authRoutes from './authRoutes.js';
import challengeRoutes from './challengeRoutes.js';
import projectRoutes from './projectRoutes.js';
import universityRoutes from './universityRoutes.js';
import industryRoutes from './industryRoutes.js';
import governmentRoutes from './governmentRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import adminRoutes from './adminRoutes.js';
import uploadRoutes from './uploadRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/challenges', challengeRoutes);
router.use('/projects', projectRoutes);
router.use('/universities', universityRoutes);
router.use('/industries', industryRoutes);
router.use('/government', governmentRoutes);
router.use('/notifications', notificationRoutes);
router.use('/admin', adminRoutes);
router.use('/uploads', uploadRoutes);

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'JSIP API is running' });
});

export default router;
