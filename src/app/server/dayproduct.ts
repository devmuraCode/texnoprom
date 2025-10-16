import { httpClient } from "../httpClient/httpClient";
import type { IDayProduct } from "@/shared/types/dayproduct";

export const getDayProduct = async (): Promise<IDayProduct[]> => {
  const { data } = await httpClient.get<IDayProduct[]>("/products/dayproduct/");
  return data;
};
