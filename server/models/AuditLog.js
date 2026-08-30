import mongoose from 'mongoose';
import { AUDIT_ACTIONS } from '../utils/constants.js';

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      enum: AUDIT_ACTIONS,
      required: true,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    targetType: {
      type: String,
      enum: ['User', 'Challenge', 'Project', 'University', 'Industry', 'Notification', 'System'],
    },
    targetId: mongoose.Schema.Types.ObjectId,
    details: { type: mongoose.Schema.Types.Mixed },
    ipAddress: { type: String, trim: true },
    userAgent: { type: String, trim: true },
    success: { type: Boolean, default: true },
    errorMessage: { type: String, trim: true },
  },
  { timestamps: true }
);

auditLogSchema.index({ action: 1, createdAt: -1 });
auditLogSchema.index({ performedBy: 1, createdAt: -1 });
auditLogSchema.index({ targetType: 1, targetId: 1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
