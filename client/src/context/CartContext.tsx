import {
  createContext,
  useContext,
  useEffect,
  useState,
  
} from "react";

import type { Design, CartItem } from "../types";
import type { ReactNode } from "react";

interface CartContextType {
  items: CartItem[];
  addToCart: (design: Design, quantity?: number) => void;
  removeFromCart: (designId: string) => void;
  updateQuantity: (designId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("app_cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("app_cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (design: Design, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.design.id === design.id);

      if (existing) {
        return prev.map((item) =>
          item.design.id === design.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prev, { design, quantity }];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (designId: string) => {
    setItems((prev) =>
      prev.filter((item) => item.design.id !== designId)
    );
  };

  const updateQuantity = (designId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(designId);
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.design.id === designId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setIsCartOpen(false);
  };

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const cartTotal = items.reduce(
    (sum, item) => sum + item.design.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}