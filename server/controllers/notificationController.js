import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/AppError.js';
import {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
} from '../services/notification/notificationService.js';

export const getNotifications = catchAsync(async (req, res) => {
  const result = await getUserNotifications(req.user._id, {
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 20,
    unreadOnly: req.query.unreadOnly === 'true',
  });
  res.status(200).json({ success: true, ...result });
});

export const markNotificationRead = catchAsync(async (req, res) => {
  const notification = await markAsRead(req.params.id, req.user._id);
  if (!notification) throw new AppError('Notification not found', 404);
  res.status(200).json({ success: true, data: notification });
});

export const markAllNotificationsRead = catchAsync(async (req, res) => {
  const count = await markAllAsRead(req.user._id);
  res.status(200).json({ success: true, message: `${count} notifications marked as read` });
});
