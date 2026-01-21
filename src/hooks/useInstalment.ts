"use client";

import { useQuery } from "@tanstack/react-query";

export interface IInstallment {
  id: string;
  title: string;
  logo: string;
  percent: number;
  monthly_payment: number;
}

export function useInstallment({
  productId,
  months,
}: {
  productId: string;
  months: number;
}) {
  return useQuery<IInstallment[]>({
    queryKey: ["installment", productId, months],
    enabled: !!productId && months > 0,
    queryFn: async () => {
      const res = await fetch(
        `/api/installment?product_id=${encodeURIComponent(
          productId
        )}&months=${months}`,
        { cache: "no-store" }
      );

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || data?.detail || "Ошибка рассрочки");
      }

      return data as IInstallment[];
    },
  });
}
