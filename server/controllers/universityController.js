import University from '../models/University.js';
import { AppError } from '../utils/AppError.js';
import { catchAsync } from '../utils/catchAsync.js';
import { logAudit } from '../utils/auditLogger.js';

export const getUniversities = catchAsync(async (req, res) => {
  const { district, verified, search, page = 1, limit = 20 } = req.query;
  const query = {};
  if (district) query.district = district;
  if (verified !== undefined) query.verified = verified === 'true';
  if (search) query.$text = { $search: search };

  const skip = (Number(page) - 1) * Number(limit);
  const [universities, total] = await Promise.all([
    University.find(query).sort({ name: 1 }).skip(skip).limit(Number(limit)),
    University.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    data: universities,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
  });
});

export const getUniversity = catchAsync(async (req, res) => {
  const university = await University.findById(req.params.id);
  if (!university) throw new AppError('University not found', 404);
  res.status(200).json({ success: true, data: university });
});

export const createUniversity = catchAsync(async (req, res) => {
  const university = await University.create({
    ...req.body,
    createdBy: req.user._id,
  });

  await logAudit({
    action: 'university_create',
    performedBy: req.user._id,
    targetType: 'University',
    targetId: university._id,
    req,
  });

  res.status(201).json({ success: true, data: university });
});

export const updateUniversity = catchAsync(async (req, res) => {
  const university = await University.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!university) throw new AppError('University not found', 404);

  await logAudit({
    action: 'university_update',
    performedBy: req.user._id,
    targetType: 'University',
    targetId: university._id,
    req,
  });

  res.status(200).json({ success: true, data: university });
});

export const deleteUniversity = catchAsync(async (req, res) => {
  const university = await University.findByIdAndDelete(req.params.id);
  if (!university) throw new AppError('University not found', 404);
  res.status(200).json({ success: true, message: 'University deleted' });
});

export const verifyUniversity = catchAsync(async (req, res) => {
  const university = await University.findByIdAndUpdate(
    req.params.id,
    { verified: true },
    { new: true }
  );
  if (!university) throw new AppError('University not found', 404);
  res.status(200).json({ success: true, data: university });
});
