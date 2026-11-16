import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/env.js';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middlewares/error.js';

// Tách createApp khỏi server.js để test không cần mở cổng cố định
export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({ origin: config.corsOrigin }));
  app.use(express.json({ limit: '100kb' }));
  if (config.env !== 'test') app.use(morgan('combined'));

  app.use('/api', routes);
  app.use(notFound);
  app.use(errorHandler);
  return app;
}
