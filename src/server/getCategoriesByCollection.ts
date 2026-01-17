import { httpClient } from "../httpClient/httpClient";
import { getBrandsByCategorySlug } from "./getBrandsByCategorySlug";

type CategoryApi = {
  id: string;
  title: string;
  slug: string;
  img: string | null;
};

export type CatalogCategory = {
  category_id: string;
  category_title: string;
  category_slug: string;
  img: string | null;
  children: Array<{
    brand_id: string;
    brand_title: string;
    brand_slug: string;
    logo: string | null;
  }>;
};

export const getCategoriesByCollection = async (
  collectionSlug: string
): Promise<CatalogCategory[]> => {
  const { data: categories } = await httpClient.get<CategoryApi[]>(
    `/categories/collections/${encodeURIComponent(collectionSlug)}/`
  );

  const enriched = await Promise.all(
    categories.map(async (c) => {
      let brands: any[] = [];
      try {
        brands = await getBrandsByCategorySlug(c.slug);
      } catch {
        brands = [];
      }

      return {
        category_id: c.id,
        category_title: c.title,
        category_slug: c.slug,
        img: c.img,
        children: brands.map((b) => ({
          brand_id: b.id,
          brand_title: b.title,
          brand_slug: b.slug,
          logo: b.logo,
        })),
      };
    })
  );

  return enriched;
};
