import * as orderService from '../services/order.service.js';

export async function create(req, res) {
  const order = await orderService.createOrder(req.user.id, req.body.items);
  res.status(201).json(order);
}

export async function listMine(req, res) {
  res.json(await orderService.listMine(req.user.id));
}
