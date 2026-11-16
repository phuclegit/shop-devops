import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { HttpError } from '../utils/httpError.js';

export function requireAuth(req, _res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return next(new HttpError(401, 'Missing or invalid Authorization header'));
  }
  try {
    const payload = jwt.verify(token, config.jwtSecret);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    next(new HttpError(401, 'Invalid or expired token'));
  }
}

export const requireRole = (role) => (req, _res, next) =>
  req.user?.role === role ? next() : next(new HttpError(403, 'Forbidden'));
