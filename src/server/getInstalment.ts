import { httpClient } from "@/httpClient/httpClient";
import type { IInstallment } from "@/shared/types/instalment";

export const getInstallment = async (
  productId: string,
  months: number
): Promise<IInstallment[]> => {
  const { data } = await httpClient.get<IInstallment[]>(
    `/installmentapi/calculate_installment/?product_id=${productId}&months=${months}`
  );
  return data;
};
