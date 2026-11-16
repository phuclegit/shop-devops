import { config } from '../config/env.js';
import { HttpError } from '../utils/httpError.js';

export function notFound(_req, _res, next) {
  next(new HttpError(404, 'Route not found'));
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  const status = err.status || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({
    error: {
      message: status >= 500 && config.env === 'production' ? 'Internal server error' : err.message,
      details: err.details,
    },
  });
}
