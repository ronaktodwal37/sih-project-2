import Industry from '../models/Industry.js';
import { AppError } from '../utils/AppError.js';
import { catchAsync } from '../utils/catchAsync.js';
import { logAudit } from '../utils/auditLogger.js';

export const getIndustries = catchAsync(async (req, res) => {
  const { district, verified, search, page = 1, limit = 20 } = req.query;
  const query = {};
  if (district) query.districts = district;
  if (verified !== undefined) query.verified = verified === 'true';
  if (search) query.$text = { $search: search };

  const skip = (Number(page) - 1) * Number(limit);
  const [industries, total] = await Promise.all([
    Industry.find(query).sort({ companyName: 1 }).skip(skip).limit(Number(limit)),
    Industry.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    data: industries,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
  });
});

export const getIndustry = catchAsync(async (req, res) => {
  const industry = await Industry.findById(req.params.id);
  if (!industry) throw new AppError('Industry not found', 404);
  res.status(200).json({ success: true, data: industry });
});

export const createIndustry = catchAsync(async (req, res) => {
  const industry = await Industry.create({
    ...req.body,
    createdBy: req.user._id,
  });

  await logAudit({
    action: 'industry_create',
    performedBy: req.user._id,
    targetType: 'Industry',
    targetId: industry._id,
    req,
  });

  res.status(201).json({ success: true, data: industry });
});

export const updateIndustry = catchAsync(async (req, res) => {
  const industry = await Industry.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!industry) throw new AppError('Industry not found', 404);

  await logAudit({
    action: 'industry_update',
    performedBy: req.user._id,
    targetType: 'Industry',
    targetId: industry._id,
    req,
  });

  res.status(200).json({ success: true, data: industry });
});

export const deleteIndustry = catchAsync(async (req, res) => {
  const industry = await Industry.findByIdAndDelete(req.params.id);
  if (!industry) throw new AppError('Industry not found', 404);
  res.status(200).json({ success: true, message: 'Industry deleted' });
});

export const verifyIndustry = catchAsync(async (req, res) => {
  const industry = await Industry.findByIdAndUpdate(
    req.params.id,
    { verified: true },
    { new: true }
  );
  if (!industry) throw new AppError('Industry not found', 404);
  res.status(200).json({ success: true, data: industry });
});
