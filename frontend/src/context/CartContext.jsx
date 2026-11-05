/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "cart";

const loadCart = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);
  const [toast, setToast] = useState({ message: "", show: false });
  const timer = useRef();

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable: cart lasts until reload */
    }
  }, [items]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const notify = useCallback((message) => {
    clearTimeout(timer.current);
    setToast({ message, show: true });
    timer.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 2000);
  }, []);

  const addItem = useCallback(
    (product, qty = 1) => {
      const existing = items.find((i) => i.id === product.id);
      const have = existing ? existing.qty : 0;
      const next = Math.min(have + qty, product.stock ?? Infinity);
      if (next === have) {
        notify("No more stock available");
        return;
      }
      if (existing) {
        setItems(items.map((i) => (i.id === product.id ? { ...i, qty: next } : i)));
      } else {
        const { id, name, category, price, img, stock } = product;
        setItems([...items, { id, name, category, price, img, stock, qty: next }]);
      }
      notify("Added to Cart");
    },
    [items, notify]
  );

  const changeQty = useCallback((id, delta) => {
    setItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: Math.min(i.qty + delta, i.stock ?? Infinity) } : i))
        .filter((i) => i.qty > 0)
    );
  }, []);

  const remove = useCallback((id) => setItems((prev) => prev.filter((i) => i.id !== id)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      items,
      count: items.reduce((sum, i) => sum + i.qty, 0),
      total: items.reduce((sum, i) => sum + i.price * i.qty, 0),
      addItem,
      changeQty,
      remove,
      clear,
      notify,
    }),
    [items, addItem, changeQty, remove, clear, notify]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <div className={`toast${toast.show ? " show" : ""}`} role="status" aria-live="polite">
        {toast.message}
      </div>
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
