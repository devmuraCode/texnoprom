import type { IBrand } from "@/shared/types/brands";
import { httpClient } from "../httpClient/httpClient";

export const getBrands = async (): Promise<IBrand[]> => {
  const { data } = await httpClient.get<IBrand[]>("/brands");
  return data;
};
