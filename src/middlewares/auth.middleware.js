import { verifyAccessToken } from "#src/utils/jwt.utils.js";
import { AuthError, ForbiddenError } from "#src/utils/error.class.js";

function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AuthError("No token provided"));
  }

  const token = authHeader.split(" ")[1];
  const payload = verifyAccessToken(token);
  req.user = { id: payload.id, role: payload.role };
  next();
}

export function requireAuth(req, res, next) {
  authenticate(req, res, next);
}

export function requireAdmin(req, res, next) {
  const skipAuth = ['.js', '.css', '.map', '.ico'].some(ext => req.path.endsWith(ext)) ||
                   ['/assets/', '/api/resources/'].some(path => req.path.includes(path)) ||
                   (req.path.startsWith('/admin/') && req.path !== '/admin');

  if (skipAuth) {
    return next();
  }

  let authHeader = req.headers["authorization"];
  const queryToken = req.query.token;

  if (!authHeader && queryToken) {
    req.headers["authorization"] = `Bearer ${queryToken}`;
  }

  authenticate(req, res, (err) => {
    if (err) return next(err);

    if (req.user.role !== "admin") {
      return next(new ForbiddenError("Admin access required"));
    }

    next();
  });
}
