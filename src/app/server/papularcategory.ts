import { httpClient } from "../httpClient/httpClient";
import type { IPapularCategory } from "@/shared/types/papularcategorytype";

export const getPapularCategory = async (): Promise<IPapularCategory[]> => {
  const { data } = await httpClient.get<{ category: IPapularCategory[] }>(
    "/categories/popular/"
  );
  console.log("getPapularCategory response:", data);
  return data[0]?.category || [];
};
