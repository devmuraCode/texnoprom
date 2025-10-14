import { httpClient } from "../httpClient/httpClient";

export const getBanners = async () => {
  const { data } = await httpClient.get("banners");
  return data;
};
