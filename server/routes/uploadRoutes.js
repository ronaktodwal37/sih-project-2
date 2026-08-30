import express from 'express';
import { upload, uploadSingle, uploadMultiple } from '../controllers/uploadController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);

router.post('/single', upload.single('file'), uploadSingle);
router.post('/multiple', upload.array('files', 10), uploadMultiple);

export default router;
