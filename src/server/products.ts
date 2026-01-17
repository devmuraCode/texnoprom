import { httpClient } from "@/httpClient/httpClient";

export type ApiListResponse<T> = {
  length: number;
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

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

export async function getProductsByBrandSlug(
  brandSlug: string
): Promise<ApiListResponse<Product>> {
  const res = await fetch(`${httpClient}/products/brands/${brandSlug}/`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Ошибка загрузки товаров по бренду");
  return res.json();
}

export async function getProductsByBrandCategorySlug(
  brandSlug: string
): Promise<ApiListResponse<Product>> {
  const res = await fetch(
    `${httpClient}/products/brand-category/${brandSlug}/`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) throw new Error("Ошибка загрузки товаров по brand-category");
  return res.json();
}
