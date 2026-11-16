// Dữ liệu mẫu để dev/demo. Chạy lại nhiều lần vẫn an toàn (idempotent).
import bcrypt from 'bcryptjs';
import { pool } from './pool.js';

const products = [
  ['Áo thun basic trắng', 'Cotton 100%, form regular', 199000, 50],
  ['Áo sơ mi oxford xanh', 'Vải oxford dày dặn', 349000, 30],
  ['Quần jean slim fit', 'Denim co giãn nhẹ', 499000, 25],
  ['Quần short kaki', 'Kaki mềm, thoáng mát', 279000, 40],
  ['Giày sneaker trắng', 'Đế cao su êm chân', 790000, 15],
  ['Balo laptop 15.6"', 'Chống nước, nhiều ngăn', 450000, 20],
  ['Mũ lưỡi trai đen', 'Free size', 129000, 60],
  ['Tất cổ cao (set 5 đôi)', 'Cotton thoáng khí', 99000, 100],
];

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@shop.local';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
  const hash = await bcrypt.hash(adminPassword, 10);

  await pool.query(
    `INSERT INTO users (email, password_hash, full_name, role)
     VALUES ($1, $2, 'Administrator', 'admin')
     ON CONFLICT (email) DO NOTHING`,
    [adminEmail, hash],
  );

  const { rows } = await pool.query('SELECT count(*)::int AS n FROM products');
  if (rows[0].n === 0) {
    for (const [name, description, price, stock] of products) {
      await pool.query(
        'INSERT INTO products (name, description, price, stock) VALUES ($1,$2,$3,$4)',
        [name, description, price, stock],
      );
    }
    console.log(`[seed] inserted ${products.length} products`);
  }
  console.log(`[seed] done (admin: ${adminEmail})`);
}

main()
  .catch((err) => {
    console.error('[seed] failed:', err);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
