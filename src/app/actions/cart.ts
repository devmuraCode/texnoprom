"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function addToCartAction(productId: string) {
  const cookieStore = cookies();
  let cart: string[] = [];

  const existingCart = cookieStore.get("cart")?.value;
  if (existingCart) {
    try {
      cart = JSON.parse(existingCart);
    } catch (e) {
      cart = [];
    }
  }

  // Добавляем товар (просто ID, чтобы не хранить много данных в куках)
  if (!cart.includes(productId)) {
    cart.push(productId);
  }

  // Сохраняем в куки (на 30 дней)
  cookieStore.set("cart", JSON.stringify(cart), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  // Обновляем страницу корзины
  revalidatePath("/cart");
  revalidatePath("/");

  return { success: true };
}
