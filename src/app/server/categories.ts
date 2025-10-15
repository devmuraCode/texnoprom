import type { Category } from "@/shared/types/category";
import { httpClient } from "../httpClient/httpClient";

export const getCategories = async (): Promise<Category[]> => {
  const { data } = await httpClient.get<Category[]>("/categories");
  return data;
};
