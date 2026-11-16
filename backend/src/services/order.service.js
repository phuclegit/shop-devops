import { withTransaction } from '../db/pool.js';
import { HttpError } from '../utils/httpError.js';
import * as productRepo from '../repositories/product.repository.js';
import * as orderRepo from '../repositories/order.repository.js';

// Tạo đơn hàng trong 1 transaction: kiểm tra tồn kho -> tạo đơn -> trừ kho.
// Lỗi ở bất kỳ bước nào thì ROLLBACK toàn bộ.
export async function createOrder(userId, items) {
  // Gộp các dòng trùng productId
  const merged = new Map();
  for (const { productId, quantity } of items) {
    merged.set(productId, (merged.get(productId) || 0) + quantity);
  }

  return withTransaction(async (client) => {
    const products = await productRepo.findByIdsForUpdate([...merged.keys()], client);
    const byId = new Map(products.map((p) => [p.id, p]));

    let total = 0;
    const lines = [];
    for (const [productId, quantity] of merged) {
      const product = byId.get(productId);
      if (!product) throw new HttpError(404, `Product ${productId} not found`);
      if (product.stock < quantity) {
        throw new HttpError(409, `Not enough stock for "${product.name}"`);
      }
      total += product.price * quantity;
      lines.push({ productId, name: product.name, quantity, unitPrice: product.price });
    }

    const order = await orderRepo.insertOrder(userId, total, client);
    for (const line of lines) {
      await orderRepo.insertItem({ orderId: order.id, ...line }, client);
      await productRepo.decreaseStock(line.productId, line.quantity, client);
    }
    return { ...order, items: lines };
  });
}

export const listMine = (userId) => orderRepo.listByUser(userId);
