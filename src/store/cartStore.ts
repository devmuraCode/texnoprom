import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type InstallmentService = {
  title: string;
  monthly_payment: number;
};

export type Product = {
  id: string;
  title: string;
  price: number;
  image?: string;
  installment?: number;
  installmentService?: InstallmentService;
};

export type CartItem = Product & {
  quantity: number;
};

type CartState = {
  items: CartItem[];

  addToCart: (product: Product, qty?: number) => void;
  decrease: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;

  totalQuantity: () => number;
  totalPrice: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (product, qty = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === product.id);

          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === product.id
                  ? {
                      ...i,
                      quantity: i.quantity + qty,
                      installment: product.installment ?? i.installment,
                      installmentService:
                        product.installmentService ?? i.installmentService,
                    }
                  : i
              ),
            };
          }
          return { items: [...state.items, { ...product, quantity: qty }] };
        });
      },

      decrease: (id) => {
        set((state) => {
          const item = state.items.find((i) => i.id === id);
          if (!item) return state;

          if (item.quantity <= 1) {
            return { items: state.items.filter((i) => i.id !== id) };
          }

          return {
            items: state.items.map((i) =>
              i.id === id ? { ...i, quantity: i.quantity - 1 } : i
            ),
          };
        });
      },

      remove: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      clear: () => set({ items: [] }),

      totalQuantity: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: "cart",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);
