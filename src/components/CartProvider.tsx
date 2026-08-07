"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  image: string | null;
  price: number;
  variationLabel: string | null;
  variationValue: string | null;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string, variationValue: string | null) => void;
  updateQuantity: (
    productId: string,
    variationValue: string | null,
    quantity: number
  ) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isHydrated: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "mf-imports-cart";

function sameLine(a: CartItem, productId: string, variationValue: string | null) {
  return a.productId === productId && a.variationValue === variationValue;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore corrupted cart data
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, isHydrated]);

  const addItem = useCallback<CartContextValue["addItem"]>((item, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((p) =>
        sameLine(p, item.productId, item.variationValue)
      );
      if (existing) {
        return prev.map((p) =>
          sameLine(p, item.productId, item.variationValue)
            ? { ...p, quantity: p.quantity + quantity }
            : p
        );
      }
      return [...prev, { ...item, quantity }];
    });
  }, []);

  const removeItem = useCallback<CartContextValue["removeItem"]>(
    (productId, variationValue) => {
      setItems((prev) =>
        prev.filter((p) => !sameLine(p, productId, variationValue))
      );
    },
    []
  );

  const updateQuantity = useCallback<CartContextValue["updateQuantity"]>(
    (productId, variationValue, quantity) => {
      setItems((prev) =>
        prev
          .map((p) =>
            sameLine(p, productId, variationValue) ? { ...p, quantity } : p
          )
          .filter((p) => p.quantity > 0)
      );
    },
    []
  );

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      subtotal,
      isHydrated,
    }),
    [items, addItem, removeItem, updateQuantity, clearCart, totalItems, subtotal, isHydrated]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
