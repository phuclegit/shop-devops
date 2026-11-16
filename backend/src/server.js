import { createApp } from './app.js';
import { config } from './config/env.js';
import { pool } from './db/pool.js';

const server = createApp().listen(config.port, () => {
  console.log(`[server] listening on :${config.port} (${config.env})`);
});

// Graceful shutdown: Docker gửi SIGTERM khi stop container
async function shutdown(signal) {
  console.log(`[server] ${signal} received, shutting down`);
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
