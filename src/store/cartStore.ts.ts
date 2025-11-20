// src/store/cartStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";

export type CartItem = {
  id: string;
  title: string;
  mainimg?: string;
  price: number;
  cartQuantity: number;
  installmentMonths?: number;
  installmentService?: {
    title: string;
    monthly_payment: number;
    logo?: string;
  };
};

type CartStore = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "cartQuantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
};

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            toast.info("Количество увеличено");
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, cartQuantity: i.cartQuantity + 1 }
                  : i
              ),
            };
          }
          toast.success("Добавлено в корзину!", {
            icon: "Success",
            duration: 2000,
          });
          return { items: [...state.items, { ...item, cartQuantity: 1 }] };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, cartQuantity: Math.max(1, quantity) } : i
          ),
        })),

      clearCart: () => set({ items: [] }),

      getTotalItems: () =>
        get().items.reduce((sum, i) => sum + i.cartQuantity, 0),
      getTotalPrice: () =>
        get().items.reduce((sum, i) => sum + i.price * i.cartQuantity, 0),
    }),
    { name: "cart-storage" }
  )
);
