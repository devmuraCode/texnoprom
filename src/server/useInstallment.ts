// src/hooks/installment/useInstallment.ts
import { httpClient } from "@/httpClient/httpClient";
import { useQuery } from "@tanstack/react-query";

export interface IInstallment {
  id: string;
  title: string;
  logo: string;
  percent: number;
  monthly_payment: number;
}

export const useInstallment = ({
  productId,
  months,
}: {
  productId: string;
  months: number;
}) => {
  return useQuery<IInstallment[]>({
    queryKey: ["installment", productId, months],
    queryFn: async () => {
      const { data } = await httpClient.get(
        `/installmentapi/calculate_installment/?product_id=${productId}&months=${months}`
      );
      return data;
    },
    enabled: !!productId && months > 0,
  });
};
