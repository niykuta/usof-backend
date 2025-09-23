import { verifyAccessToken } from "#src/utils/jwt.utils.js";
import { AuthError, ForbiddenError } from "#src/utils/error.class.js";

export function requireAuth(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AuthError("No token provided"));
  }

  const token = authHeader.split(" ")[1];
  const payload = verifyAccessToken(token);
  req.user = { id: payload.id, role: payload.role };
  next();
}

export function requireAdmin(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AuthError("No token provided"));
  }

  const token = authHeader.split(" ")[1];
  const payload = verifyAccessToken(token);

  if (payload.role !== "admin") {
    return next(new ForbiddenError("Admin access required"));
  }

  req.user = { id: payload.id, role: payload.role };
  next();
}
