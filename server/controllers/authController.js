import User from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { catchAsync } from '../utils/catchAsync.js';
import { sendAuthResponse } from '../middleware/auth.js';
import { ROLES } from '../utils/constants.js';

const PUBLIC_REGISTER_ROLES = [
  ROLES.CITIZEN,
  ROLES.UNIVERSITY,
  ROLES.FACULTY,
  ROLES.STUDENT,
  ROLES.INDUSTRY,
];

export const register = catchAsync(async (req, res) => {
  const { name, email, password, role, phone, district, organization } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    throw new AppError('An account with this email already exists', 400);
  }

  let assignedRole = role || ROLES.CITIZEN;
  if (!PUBLIC_REGISTER_ROLES.includes(assignedRole)) {
    assignedRole = ROLES.CITIZEN;
  }

  const user = await User.create({
    name,
    email,
    password,
    role: assignedRole,
    phone,
    district,
    organization,
    isVerified: assignedRole === ROLES.CITIZEN,
  });

  sendAuthResponse(res, user, 201);
});

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }

  if (!user.isActive) {
    throw new AppError('Your account has been deactivated. Contact support.', 403);
  }

  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  sendAuthResponse(res, user);
});

export const logout = catchAsync(async (_req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

export const getMe = catchAsync(async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});
