import * as productService from '../services/product.service.js';

export async function list(req, res) {
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 12;
  res.json(await productService.list({ q: req.query.q, page, pageSize }));
}

export async function get(req, res) {
  res.json(await productService.get(Number(req.params.id)));
}

export async function create(req, res) {
  res.status(201).json(await productService.create(req.body));
}
