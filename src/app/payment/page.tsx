"use client";

import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useMask } from "@react-input/mask";
import { useCheckoutPayme } from "@/features/checkout/useCheckoutPayme";
import { useCartStore } from "@/store/cartStore";

const districts = [
  "Алмазарский район",
  "Бектемирский район",
  "Мирабадский район",
  "Мирзо-Улугбекский район",
  "Сергелийский район",
  "Чиланзарский район",
  "Шайхантаурский район",
  "Юнусабадский район",
  "Яккасарайский район",
  "Яшнабадский район",
  "Учтепинский район",
];

function formatUZS(value: number) {
  return Math.round(value).toLocaleString("ru-RU");
}

export default function PaymentPage() {
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.totalPrice());
  const clear = useCartStore((s) => s.clear);

  const productIds = useMemo(
    () => items.map((i: any) => String(i.id)),
    [items]
  );

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("user_id") : null;

  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [phone, setPhone] = useState("");

  const inputRef = useMask({
    mask: "+998_________",
    replacement: { _: /\d/ },
  });

  const checkout = useCheckoutPayme();

  const onPayme = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error("Корзина пустая");
      return;
    }
    if (!deliveryAddress || !selectedDistrict || !phone) {
      toast.error("Заполните все поля");
      return;
    }

    try {
      const payload = {
        amount: Math.round(total * 100),
        user: userId,
        delivery_address: deliveryAddress,
        phone_number: phone,
        district: selectedDistrict,
        products: productIds,
      };

      const link = await checkout.mutateAsync(payload);

      toast.success("Перенаправляем на оплату...");

      window.location.href = link.pay_link;
    } catch (err: any) {
      toast.error(err?.message || "Ошибка оплаты");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold mb-6">Оформить заказ</h1>

          <form onSubmit={onPayme} className="space-y-5">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Улица / Адрес
              </label>
              <input
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full rounded-lg border bg-gray-50 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Например: ул. Навои 12, кв 5"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Район
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full rounded-lg border bg-gray-50 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              >
                <option value="" disabled>
                  Выберите район
                </option>
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Телефон
              </label>
              <input
                ref={inputRef}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border bg-gray-50 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="+998"
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={checkout.isPending}
                className="w-full rounded-lg bg-red-600 py-3 text-white font-semibold hover:bg-red-700 disabled:opacity-60"
              >
                {checkout.isPending
                  ? "Создаём ссылку..."
                  : "Оплатить через Payme"}
              </button>

              <button
                type="button"
                onClick={() => toast("Uzum/Click можно добавить так же")}
                className="w-full rounded-lg border py-3 font-semibold hover:bg-gray-50"
              >
                Другой способ
              </button>
            </div>

            {checkout.isError ? (
              <div className="text-sm text-red-600">
                {(checkout.error as any)?.message || "Ошибка"}
              </div>
            ) : null}
          </form>
        </div>
        <aside className="h-fit lg:sticky lg:top-4">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="text-lg font-semibold mb-4">Ваш заказ</div>

            <div className="space-y-3 max-h-[320px] overflow-auto pr-1">
              {items.map((i: any) => (
                <div
                  key={i.id}
                  className="flex items-start justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-medium line-clamp-2">
                      {i.title}
                    </div>
                    <div className="text-xs text-gray-600">
                      {i.quantity} × {formatUZS(i.price)} сум
                    </div>
                  </div>
                  <div className="text-sm font-semibold">
                    {formatUZS(i.price * i.quantity)} сум
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t pt-4 flex items-center justify-between">
              <span className="text-sm text-gray-600">Итого</span>
              <span className="text-lg font-bold">{formatUZS(total)} сум</span>
            </div>

            <button
              type="button"
              onClick={clear}
              className="mt-3 w-full rounded-lg border py-2.5 hover:bg-gray-50"
            >
              Очистить корзину
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
