import { httpClient } from "../httpClient/httpClient";

export type BrandApi = {
  id: string;
  title: string;
  slug: string;
  logo: string | null;
  category_id: string;
};

export const getBrandsByCategorySlug = async (
  categorySlug: string
): Promise<BrandApi[]> => {
  const { data } = await httpClient.get<BrandApi[]>(
    `/brands/category/${encodeURIComponent(categorySlug)}/`
  );
  return data;
};
