import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { Product } from "../data/catalog";

type WishlistContextValue = {
  items: Product[];
  isOpen: boolean;
  openWishlist: () => void;
  closeWishlist: () => void;
  toggleItem: (product: Product) => void;
  hasItem: (slug: string) => boolean;
  clearWishlist: () => void;
  count: number;
  toast: string | null;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useMemo(() => {
    if (!toast) return undefined;
    const id = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(id);
  }, [toast]);

  const openWishlist = useCallback(() => setIsOpen(true), []);
  const closeWishlist = useCallback(() => setIsOpen(false), []);

  const toggleItem = useCallback((product: Product) => {
    setItems((prev) => {
      const exists = prev.find((p) => p.slug === product.slug);
      if (exists) {
        setToast(`Removed ${product.name} from wishlist`);
        return prev.filter((p) => p.slug !== product.slug);
      }
      setToast(`Added ${product.name} to wishlist`);
      return [...prev, product];
    });
  }, []);

  const hasItem = useCallback((slug: string) => items.some((p) => p.slug === slug), [items]);

  const clearWishlist = useCallback(() => {
    setItems([]);
    setToast("Wishlist cleared");
  }, []);

  const count = items.length;

  const value = useMemo(
    () => ({ items, isOpen, openWishlist, closeWishlist, toggleItem, hasItem, clearWishlist, count, toast }),
    [items, isOpen, openWishlist, closeWishlist, toggleItem, hasItem, clearWishlist, count, toast]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
}
