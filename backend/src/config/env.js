// Toàn bộ cấu hình đọc từ biến môi trường (nguyên tắc 12-factor app).
const DEV_SECRET = 'dev-secret-change-me';

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 3000),
  databaseUrl:
    process.env.DATABASE_URL || 'postgres://shop:shop@localhost:5432/shop',
  jwtSecret: process.env.JWT_SECRET || DEV_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  corsOrigin: process.env.CORS_ORIGIN || '*',
};

// Không cho chạy production với secret mặc định
if (config.env === 'production' && config.jwtSecret === DEV_SECRET) {
  throw new Error('JWT_SECRET must be set in production');
}
