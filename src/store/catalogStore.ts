import { create } from "zustand";

type Category = {
  category_id: string;
  category_title: string;
  category_slug: string;
  children: Array<{
    brand_id: string;
    brand_title: string;
    brand_slug: string;
  }>;
};

type CatalogState = {
  isOpen: boolean;
  openCatalog: () => void;
  closeCatalog: () => void;

  selectedSlug?: string;
  setSelectedSlug: (slug?: string) => void;

  categoriesBySlug: Record<string, Category[]>;
  setCategoriesForSlug: (slug: string, categories: Category[]) => void;
};

export const useCatalogStore = create<CatalogState>((set) => ({
  isOpen: false,
  openCatalog: () => set({ isOpen: true }),
  closeCatalog: () => set({ isOpen: false }),

  selectedSlug: undefined,
  setSelectedSlug: (slug) => set({ selectedSlug: slug }),

  categoriesBySlug: {},
  setCategoriesForSlug: (slug, categories) =>
    set((s) => ({
      categoriesBySlug: { ...s.categoriesBySlug, [slug]: categories },
    })),
}));
