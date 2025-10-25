import { httpClient } from "../httpClient/httpClient";
import type { IProduct } from "@/shared/types/product";
import type { ICharacteristic } from "@/shared/types/product";
import type { IProductPhotos } from "@/shared/types/product";
export const getProduct = async (slug: string): Promise<IProduct> => {
  const { data } = await httpClient.get<IProduct>(
    `/products/getproduct/${slug}`
  );
  return data;
};
export const getCharacteristics = async (
  slug: string
): Promise<ICharacteristic[]> => {
 const { data } = await httpClient.get<ICharacteristic[]>(
   `/characteristics/${slug}`
 );
  return data;
};

export const getPhotos = async (slug: string): Promise<IProductPhotos[]> => {
  const { data } = await httpClient.get<IProductPhotos[]>(`/photos/${slug}`);
  return data;
};
