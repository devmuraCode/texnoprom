import { create } from "zustand";

interface CatalogStore {
  isOpen: boolean;
  openCatalog: () => void;
  closeCatalog: () => void;
  toggleCatalog: () => void;
}

export const useCatalogStore = create<CatalogStore>((set) => ({
  isOpen: false,
  openCatalog: () => set({ isOpen: true }),
  closeCatalog: () => set({ isOpen: false }),
  toggleCatalog: () => set((state) => ({ isOpen: !state.isOpen })),
}));
