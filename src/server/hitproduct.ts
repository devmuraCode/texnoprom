import { httpClient } from "../httpClient/httpClient";
import type { IHitProductResponse } from "@/shared/types/product";

export const getHitProduct = async (): Promise<IHitProductResponse> => {
  const { data } = await httpClient.get<IHitProductResponse>(
    "/products/popular/"
  );
  return data;
};
