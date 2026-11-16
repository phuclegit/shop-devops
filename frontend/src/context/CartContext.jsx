import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  // items: [{ product, quantity }], lưu localStorage để F5 không mất giỏ
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cart')) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const add = (product) =>
    setItems((prev) => {
      const found = prev.find((i) => i.product.id === product.id);
      return found
        ? prev.map((i) => (i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i))
        : [...prev, { product, quantity: 1 }];
    });

  const setQuantity = (id, quantity) =>
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.product.id !== id)
        : prev.map((i) => (i.product.id === id ? { ...i, quantity } : i)),
    );

  const clear = () => setItems([]);
  const count = items.reduce((s, i) => s + i.quantity, 0);
  const total = items.reduce((s, i) => s + i.quantity * i.product.price, 0);

  return (
    <CartContext.Provider value={{ items, add, setQuantity, clear, count, total }}>
      {children}
    </CartContext.Provider>
  );
}
