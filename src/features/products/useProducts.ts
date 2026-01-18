"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getProductsByBrandSlug,
  getProductsByBrandCategorySlug,
  getProductsByCategorySlug,
} from "@/server/products";

export function useProductsByCategory(slug: string) {
  return useQuery({
    queryKey: ["products", "category", slug],
    queryFn: () => getProductsByCategorySlug(slug),
    enabled: !!slug,
  });
}

export function useProductsByBrand(slug: string) {
  return useQuery({
    queryKey: ["products", "brand", slug],
    queryFn: () => getProductsByBrandSlug(slug),
    enabled: !!slug,
  });
}

export function useProductsByBrandCategory(slug: string) {
  return useQuery({
    queryKey: ["products", "brand-category", slug],
    queryFn: () => getProductsByBrandCategorySlug(slug),
    enabled: !!slug,
  });
}
