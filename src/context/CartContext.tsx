import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "../data/catalog";
import { useAuth } from "./AuthContext";
import { api } from "../api";

export type CartLine = {
  key: string;
  id?: number;
  product: Product;
  product_id?: number;
  size?: string;
  color?: string;
  quantity: number;
};

type CartContextValue = {
  lines: CartLine[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, options?: { size?: string; color?: string; quantity?: number }) => void;
  removeItem: (key: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  count: number;
  subtotal: number;
  toast: string | null;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!toast) return undefined;
    const id = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    if (isAuthenticated) {
      api.cart.list().then((res) => {
        setLines(
          res.items.map((item) => ({
            key: `${item.product.slug}-${item.size ?? "one"}-${item.color ?? "one"}`,
            id: item.id,
            product_id: item.product_id,
            product: item.product,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
          }))
        );
      }).catch(() => {});
    } else {
      setLines([]);
    }
  }, [isAuthenticated]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback(
    (product: Product, options: { size?: string; color?: string; quantity?: number } = {}) => {
      const size = options.size ?? product.sizes?.[2] ?? product.sizes?.[0];
      const color = options.color ?? product.colors?.[0];
      const key = `${product.slug}-${size ?? "one"}-${color ?? "one"}`;
      setLines((prev) => {
        const existing = prev.find((l) => l.key === key);
        if (existing) {
          return prev.map((l) => (l.key === key ? { ...l, quantity: l.quantity + (options.quantity ?? 1) } : l));
        }
        return [...prev, { key, product, size, color, quantity: options.quantity ?? 1 }];
      });
      setToast(`Added ${product.name}`);
      setIsOpen(true);
    },
    []
  );

  const removeItem = useCallback((key: string) => {
    setLines((prev) => prev.filter((l) => l.key !== key));
  }, []);

  const setQuantity = useCallback((key: string, quantity: number) => {
    setLines((prev) =>
      prev
        .map((l) => (l.key === key ? { ...l, quantity: Math.max(0, quantity) } : l))
        .filter((l) => l.quantity > 0)
    );
  }, []);

  const count = useMemo(() => lines.reduce((acc, l) => acc + l.quantity, 0), [lines]);
  const subtotal = useMemo(() => lines.reduce((acc, l) => acc + l.quantity * l.product.price, 0), [lines]);

  const value = useMemo(
    () => ({ lines, isOpen, openCart, closeCart, addItem, removeItem, setQuantity, count, subtotal, toast }),
    [lines, isOpen, openCart, closeCart, addItem, removeItem, setQuantity, count, subtotal, toast]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
