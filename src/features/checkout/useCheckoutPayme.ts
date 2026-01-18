"use client";

import { useMutation } from "@tanstack/react-query";

type CheckoutBody = {
  amount: number; // в тийинах/копейках (ты делал *100)
  user: string | null;
  delivery_address: string;
  phone_number: string;
  district: string;
  products: string[]; // ids
};

// ответ твоего /orders/ (минимально)
type OrderResponse = {
  id: string;
  amount: number;
};

// ответ твоего /pay-link/
type PayLinkResponse = {
  pay_link: string;
};

async function postJson<T>(
  url: string,
  body: any,
  token?: string | null
): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    // покажем нормальную ошибку
    const message =
      data?.detail ||
      data?.message ||
      (typeof data === "string" ? data : "Ошибка запроса");
    throw new Error(message);
  }

  return data as T;
}

export function useCheckoutPayme() {
  return useMutation({
    mutationFn: async (payload: CheckoutBody) => {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      // 1) create order
      const order = await postJson<OrderResponse>(
        "/api/checkout/order",
        payload,
        token
      );

      // 2) get pay link
      const link = await postJson<PayLinkResponse>(
        "/api/checkout/pay-link",
        { order_id: order.id, amount: order.amount },
        token
      );

      return link;
    },
  });
}
