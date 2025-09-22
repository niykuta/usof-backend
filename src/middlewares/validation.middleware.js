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

export const postCreateSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  status: z.enum(["active", "inactive"]).default("active"),
  categories: z.array(z.number().int()).min(1, "At least one category is required")
});

export const postUpdateSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").optional(),
  content: z.string().min(10, "Content must be at least 10 characters").optional(),
  status: z.enum(["active", "inactive"]).optional(),
  categories: z.array(z.number().int()).optional()
});

export const commentCreateSchema = z.object({
  content: z.string().min(1, "Content cannot be empty"),
});

export const commentUpdateSchema = z.object({
  status: z.enum(["active", "inactive"]),
});

export const likeSchema = z.object({
  type: z.enum(["like", "dislike"]),
});

export const validateLike = validate(likeSchema);
export const validateCommentCreate = validate(commentCreateSchema);
export const validateCommentUpdate = validate(commentUpdateSchema);
export const validatePostCreate = validate(postCreateSchema);
export const validatePostUpdate = validate(postUpdateSchema);
export const validateRegister = validate(registerSchema);
export const validateLogin = validate(loginSchema);
