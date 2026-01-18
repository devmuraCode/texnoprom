"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { useCartStore } from "@/store/cartStore";

function formatUZS(value: number) {
  return Math.round(value).toLocaleString("ru-RU");
}

export default function Cart() {
  const items = useCartStore((s) => s.items);
  const addToCart = useCartStore((s) => s.addToCart);
  const decrease = useCartStore((s) => s.decrease);
  const remove = useCartStore((s) => s.remove);
  const clear = useCartStore((s) => s.clear);

  const totalPrice = useCartStore((s) => s.totalPrice());

  const totalCount = useMemo(
    () => items.reduce((acc, i) => acc + (i.quantity ?? 0), 0),
    [items]
  );

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-2">Корзина</h1>
        <p className="text-gray-600 mb-6">Корзина пустая</p>

        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          Перейти к покупкам
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Корзина</h1>
          <p className="text-sm text-gray-600">
            Товаров: <span className="font-semibold">{totalCount}</span>
          </p>
        </div>

        <button
          onClick={clear}
          className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
        >
          Очистить
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-4">
          {items.map((i: any) => {
            const lineTotal = (i.price ?? 0) * (i.quantity ?? 0);

            return (
              <div
                key={i.id}
                className="rounded-xl border bg-white p-4 shadow-sm"
              >
                <div className="flex gap-4">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-50">
                    {i.image ? (
                      <Image
                        src={i.image}
                        alt={i.title}
                        fill
                        className="object-contain"
                        sizes="80px"
                      />
                    ) : null}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-900 line-clamp-2">
                          {i.title}
                        </div>

                        <div className="mt-1 text-sm text-gray-600">
                          Цена:{" "}
                          <span className="font-medium text-gray-900">
                            {formatUZS(i.price)} сум
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => remove(i.id)}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Удалить
                      </button>
                    </div>

                    <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="inline-flex items-center rounded-lg border bg-white">
                        <button
                          onClick={() => decrease(i.id)}
                          className="h-10 w-10 grid place-items-center hover:bg-gray-50 rounded-l-lg"
                          aria-label="Уменьшить"
                        >
                          −
                        </button>

                        <div className="h-10 min-w-12 px-3 grid place-items-center font-semibold">
                          {i.quantity}
                        </div>

                        <button
                          onClick={() => addToCart(i, 1)}
                          className="h-10 w-10 grid place-items-center hover:bg-gray-50 rounded-r-lg"
                          aria-label="Увеличить"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-sm sm:text-right">
                        <div className="text-gray-600">Сумма</div>
                        <div className="font-bold text-gray-900">
                          {formatUZS(lineTotal)} сум
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <aside className="h-fit lg:sticky lg:top-4">
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="text-lg font-semibold mb-4">Итого</div>

            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">Товаров</span>
              <span className="font-medium">{totalCount}</span>
            </div>

            <div className="flex items-center justify-between text-sm mb-4">
              <span className="text-gray-600">Сумма</span>
              <span className="font-bold text-gray-900">
                {formatUZS(totalPrice)} сум
              </span>
            </div>

            <button className="w-full rounded-lg bg-red-600 py-3 text-white font-semibold hover:bg-red-700">
              Оформить заказ
            </button>

            <Link
              href="/"
              className="mt-3 block w-full rounded-lg border py-3 text-center font-medium hover:bg-gray-50"
            >
              Продолжить покупки
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
