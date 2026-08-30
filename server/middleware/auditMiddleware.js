import { logAudit } from '../utils/auditLogger.js';

export const auditAction = (action, targetType) => (req, res, next) => {
  const originalJson = res.json.bind(res);

  res.json = (body) => {
    if (res.statusCode < 400) {
      logAudit({
        action,
        performedBy: req.user?._id,
        targetType,
        targetId: req.params?.id || body?.data?._id,
        details: {
          method: req.method,
          path: req.originalUrl,
          body: sanitizeBody(req.body),
        },
        req,
      });
    }
    return originalJson(body);
  };

  next();
};

const sanitizeBody = (body) => {
  if (!body) return {};
  const sanitized = { ...body };
  delete sanitized.password;
  delete sanitized.token;
  return sanitized;
};

export default { auditAction };
