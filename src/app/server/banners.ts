import { httpClient } from "../httpClient/httpClient";
import type { IBanner } from "@/shared/types/banners";

export const getBanners = async (): Promise<IBanner[]> => {
  const { data } = await httpClient.get<IBanner[]>("/banners");
  return data;
};
