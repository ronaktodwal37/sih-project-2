import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';
import { AppError } from '../utils/AppError.js';
import { catchAsync } from '../utils/catchAsync.js';
import { logAudit } from '../utils/auditLogger.js';

export const getUsers = catchAsync(async (req, res) => {
  const { role, isActive, search, page = 1, limit = 20 } = req.query;
  const query = {};
  if (role) query.role = role;
  if (isActive !== undefined) query.isActive = isActive === 'true';
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [users, total] = await Promise.all([
    User.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    User.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    data: users,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
  });
});

export const getUser = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new AppError('User not found', 404);
  res.status(200).json({ success: true, data: user });
});

export const updateUser = catchAsync(async (req, res) => {
  const { password, ...updates } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) throw new AppError('User not found', 404);

  Object.assign(user, updates);
  if (password) user.password = password;
  await user.save();

  await logAudit({
    action: 'admin_action',
    performedBy: req.user._id,
    targetType: 'User',
    targetId: user._id,
    details: { action: 'update', fields: Object.keys(updates) },
    req,
  });

  res.status(200).json({ success: true, data: user });
});

export const deactivateUser = catchAsync(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!user) throw new AppError('User not found', 404);

  await logAudit({
    action: 'admin_action',
    performedBy: req.user._id,
    targetType: 'User',
    targetId: user._id,
    details: { action: 'deactivate' },
    req,
  });

  res.status(200).json({ success: true, data: user });
});

export const activateUser = catchAsync(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isActive: true }, { new: true });
  if (!user) throw new AppError('User not found', 404);
  res.status(200).json({ success: true, data: user });
});

export const getAuditLogs = catchAsync(async (req, res) => {
  const { action, performedBy, targetType, page = 1, limit = 50 } = req.query;
  const query = {};
  if (action) query.action = action;
  if (performedBy) query.performedBy = performedBy;
  if (targetType) query.targetType = targetType;

  const skip = (Number(page) - 1) * Number(limit);
  const [logs, total] = await Promise.all([
    AuditLog.find(query)
      .populate('performedBy', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    AuditLog.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    data: logs,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
  });
});

export const getStats = catchAsync(async (_req, res) => {
  const [totalUsers, activeUsers, usersByRole] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isActive: true }),
    User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalUsers,
      activeUsers,
      usersByRole: usersByRole.map((r) => ({ role: r._id, count: r.count })),
    },
  });
});
