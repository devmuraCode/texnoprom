import { httpClient } from "@/httpClient/httpClient";
import type { ApiListResponse } from "@/shared/types/api";

export type Product = {
  id: string;
  title: string;
  slug: string;
  mainimg: string;
  price: string;
  discounted_price?: number;
  installment?: number;
  discount_percent?: string;
  stock_quantity?: number;
  updated_at?: string;
};

export async function getProductsByBrandSlug(brandSlug: string) {
  const { data } = await httpClient.get<ApiListResponse<Product>>(
    `/products/brands/${encodeURIComponent(brandSlug)}/`
  );
  return data;
}

export async function getProductsByBrandCategorySlug(brandSlug: string) {
  const { data } = await httpClient.get<ApiListResponse<Product>>(
    `/products/brand-category/${encodeURIComponent(brandSlug)}/`
  );
  return data;
}

export async function getProductsByCategorySlug(categorySlug: string) {
  const { data } = await httpClient.get<ApiListResponse<Product>>(
    `/products/categories/${encodeURIComponent(categorySlug)}/`
  );
  return data;
}
