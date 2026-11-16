// Service: logic nghiệp vụ, gọi repository.
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { HttpError } from '../utils/httpError.js';
import * as userRepo from '../repositories/user.repository.js';

const signToken = (user) =>
  jwt.sign({ role: user.role }, config.jwtSecret, {
    subject: String(user.id),
    expiresIn: config.jwtExpiresIn,
  });

export async function register({ email, password, fullName }) {
  if (await userRepo.findByEmail(email)) {
    throw new HttpError(409, 'Email already registered');
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await userRepo.create({ email, passwordHash, fullName });
  return { user, token: signToken(user) };
}

export async function login({ email, password }) {
  const user = await userRepo.findByEmail(email);
  // Cùng 1 thông báo cho cả "sai email" và "sai mật khẩu" để không lộ thông tin
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    throw new HttpError(401, 'Invalid email or password');
  }
  const { password_hash, ...safeUser } = user;
  return { user: safeUser, token: signToken(user) };
}

export async function me(userId) {
  const user = await userRepo.findById(userId);
  if (!user) throw new HttpError(404, 'User not found');
  return user;
}
