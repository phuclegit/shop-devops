import { HttpError } from '../utils/httpError.js';
import * as productRepo from '../repositories/product.repository.js';

export async function list({ q, page = 1, pageSize = 12 }) {
  const limit = Math.min(Math.max(pageSize, 1), 50);
  const offset = (Math.max(page, 1) - 1) * limit;
  const { items, total } = await productRepo.list({ q, limit, offset });
  return { items, total, page, pageSize: limit };
}

export async function get(id) {
  const product = await productRepo.findById(id);
  if (!product) throw new HttpError(404, 'Product not found');
  return product;
}

export const create = (data) => productRepo.create(data);
