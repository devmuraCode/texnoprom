import type { ICollections } from "@/shared/types/collections";
import { httpClient } from "../httpClient/httpClient";

export const getCollections = async (): Promise<ICollections[]> => {
  const { data } = await httpClient.get<ICollections[]>("/collections");
  return data;
};
