import { z } from 'zod';
import { ValidationError } from '#src/utils/error.class.js';

function validate(schema) {
  return (req, res, next) => {
    try {
      req.validatedBody = schema.parse(req.body);
      next();
    } catch (err) {
      if (err.issues) {
        next(new ValidationError(err.issues.map(e => e.message)));
      } else {
        next(err);
      }
    }
  };
}

export const registerSchema = z.object({
  login: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  full_name: z.string().min(2),
});

export const loginSchema = z.object({
  login: z.string().min(3),
  password: z.string().min(8),
});

export const validateRegister = validate(registerSchema);
export const validateLogin = validate(loginSchema);
