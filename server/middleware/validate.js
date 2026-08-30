import { z } from 'zod';
import { AppError } from '../utils/AppError.js';

export const validate = (schema) => (req, _res, next) => {
  try {
    const parsed = schema.parse(req.body);
    req.body = parsed;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = error.errors.map((e) => e.message).join(', ');
      return next(new AppError(message, 400));
    }
    next(error);
  }
};
