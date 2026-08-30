import AuditLog from '../models/AuditLog.js';

export const logAudit = async ({
  action,
  performedBy,
  targetType,
  targetId,
  details,
  req,
  success = true,
  errorMessage,
}) => {
  try {
    return await AuditLog.create({
      action,
      performedBy,
      targetType,
      targetId,
      details,
      ipAddress: req?.ip || req?.headers?.['x-forwarded-for'],
      userAgent: req?.headers?.['user-agent'],
      success,
      errorMessage,
    });
  } catch (error) {
    console.error('Failed to write audit log:', error.message);
    return null;
  }
};

export default { logAudit };
