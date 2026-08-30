import multer from 'multer';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/AppError.js';
import { uploadFile } from '../services/upload/uploadService.js';
import { logAudit } from '../utils/auditLogger.js';

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'application/pdf',
      'video/mp4',
      'audio/mpeg',
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError('File type not allowed', 400));
    }
  },
});

export const uploadSingle = catchAsync(async (req, res) => {
  if (!req.file) throw new AppError('No file uploaded', 400);

  const result = await uploadFile(req.file, {
    folder: req.body.folder || 'jsip',
    resourceType: 'auto',
  });

  await logAudit({
    action: 'file_upload',
    performedBy: req.user._id,
    targetType: 'System',
    details: { filename: req.file.originalname, provider: result.provider },
    req,
  });

  res.status(201).json({ success: true, data: result });
});

export const uploadMultiple = catchAsync(async (req, res) => {
  if (!req.files?.length) throw new AppError('No files uploaded', 400);

  const results = await Promise.all(
    req.files.map((file) => uploadFile(file, { folder: req.body.folder || 'jsip' }))
  );

  await logAudit({
    action: 'file_upload',
    performedBy: req.user._id,
    targetType: 'System',
    details: { count: results.length },
    req,
  });

  res.status(201).json({ success: true, data: results });
});
