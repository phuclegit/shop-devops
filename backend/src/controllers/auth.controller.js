// Controller: nhận request, gọi service, trả response. Không chứa SQL hay nghiệp vụ.
import * as authService from '../services/auth.service.js';

export async function register(req, res) {
  const result = await authService.register(req.body);
  res.status(201).json(result);
}

export async function login(req, res) {
  res.json(await authService.login(req.body));
}

export async function me(req, res) {
  res.json(await authService.me(req.user.id));
}
