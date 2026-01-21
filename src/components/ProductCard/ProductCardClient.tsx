"use client";
import React, { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

import { useCartStore } from "@/store/cartStore";
import { useInstallment } from "@/hooks/useInstalment";

interface ProductCardClientProps {
  id: string;
  title: string;
  mainimg: string;
  price: string;
  discounted_price?: number;
  installment?: number;
  slug: string;
  discount_percent?: string;
  stock_quantity?: number;
  updated_at?: string;
  currentDateTime: string;
}

const monthsOptions = [3, 6, 9, 12, 15, 18, 24];

const toNumberPrice = (p: string) => {
  const cleaned = p.replace(/\s/g, "").replace(/,/g, ".");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
};

const formatPrice = (value: number) =>
  Math.round(value).toLocaleString("ru-RU") + " сум";

const ProductCardClient: React.FC<ProductCardClientProps> = ({
  id,
  title,
  mainimg,
  price,
  discounted_price,
  installment,
  slug,
  discount_percent,
  stock_quantity,
  updated_at,
  currentDateTime,
}) => {
  const lastUpdated = updated_at
    ? new Date(updated_at).toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : null;

  const items = useCartStore((s) => s.items);
  const addToCartStore = useCartStore((s) => s.addToCart);

  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const [selectedMonths, setSelectedMonths] = useState<number>(12);

  // const {
  //   data: installments = [],
  //   isLoading,
  //   isError,
  //   error,
  // } = useInstallment(id, selectedMonths);

  const { data: installments = [], isLoading, isError, error } = useInstallment({
    productId: id,
    months: selectedMonths,
  });

  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    null
  );
  useEffect(() => {
    if (installments.length > 0) setSelectedServiceId(installments[0].id);
    else setSelectedServiceId(null);
  }, [installments]);

  const selectedService = useMemo(() => {
    return (
      installments.find(
        (x: { id: string | null }) => x.id === selectedServiceId
      ) ?? null
    );
  }, [installments, selectedServiceId]);

  useEffect(() => {
    setIsAddedToCart(items.some((item) => item.id === id));
  }, [items, id]);

  const handleAddToCart = () => {
    if (!selectedService) {
      toast.error("Выберите тариф рассрочки");
      return;
    }

    const basePrice = toNumberPrice(price);
    const finalPrice =
      typeof discounted_price === "number" &&
      discounted_price > 0 &&
      discounted_price < basePrice
        ? discounted_price
        : basePrice;

    addToCartStore(
      {
        id,
        title,
        price: finalPrice,
        image: mainimg,
        installment: selectedMonths,
        installmentService: {
          title: selectedService.title,
          monthly_payment: selectedService.monthly_payment,
        },
      },
      1
    );

    setIsAddedToCart(true);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500);
    toast.success("Добавлено в корзину ✅");
  };

  const isOutOfStock = stock_quantity !== undefined && stock_quantity <= 0;

  return (
    <div className="flex sm:flex-row transition-shadow duration-300 w-full mx-auto">
      <div className="p-4 sm:p-6 w-full flex flex-col justify-between">
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
            {title}
          </h3>

          <div className="mb-4">
            {typeof discounted_price === "number" &&
            discounted_price > 0 &&
            discounted_price < toNumberPrice(price) ? (
              <div className="flex items-center gap-2">
                <span className="text-red-600 text-xl sm:text-2xl font-bold">
                  {discounted_price.toLocaleString("ru-RU")} сум
                </span>
                <span className="text-gray-500 line-through text-sm">
                  {toNumberPrice(price).toLocaleString("ru-RU")} сум
                </span>
                {discount_percent && Number(discount_percent) > 0 && (
                  <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                    -{discount_percent}%
                  </span>
                )}
              </div>
            ) : (
              <span className="text-gray-800 text-xl sm:text-2xl font-bold">
                {toNumberPrice(price).toLocaleString("ru-RU")} сум
              </span>
            )}
          </div>

          <div className="mb-4">
            <h4 className="font-semibold text-sm text-gray-700 mb-2">
              Варианты рассрочки
            </h4>

            <div className="flex gap-3 flex-wrap mb-3">
              {monthsOptions.map((month) => (
                <label
                  key={month}
                  className="flex flex-col items-center cursor-pointer"
                >
                  <span className="text-xs text-gray-600 mb-1">{month}</span>
                  <input
                    type="radio"
                    name={`installment-months-${id}`}
                    value={month}
                    checked={selectedMonths === month}
                    onChange={() => setSelectedMonths(month)}
                    className="w-4 h-4 text-red-600 focus:ring-red-500"
                  />
                </label>
              ))}
            </div>

            {isLoading ? (
              <p className="text-sm text-gray-500">Загрузка...</p>
            ) : isError ? (
              <p className="text-sm text-red-600">
                {(error as any)?.message || "Ошибка рассрочки"}
              </p>
            ) : installments.length > 0 ? (
              <div className="space-y-2">
                {/* @ts-ignore */}
                {installments.map((inst) => (
                  <button
                    type="button"
                    key={inst.id}
                    onClick={() => setSelectedServiceId(inst.id)}
                    className={`w-full flex items-center justify-between p-2 border rounded transition-colors ${
                      selectedServiceId === inst.id
                        ? "border-red-600 bg-red-50"
                        : "border-gray-300 hover:border-red-400"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        src={inst.logo}
                        alt={inst.title}
                        width={40}
                        height={24}
                        className="object-contain"
                      />
                      <span className="text-sm font-medium">{inst.title}</span>
                    </div>
                    <span className="text-sm font-bold text-green-600">
                      {formatPrice(inst.monthly_payment)}/мес
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Рассрочка недоступна</p>
            )}
          </div>

          {isOutOfStock && (
            <p className="text-sm text-red-600 mb-2">Нет в наличии</p>
          )}

          {lastUpdated && (
            <p className="text-xs text-gray-500">Обновлено: {lastUpdated}</p>
          )}
          <p className="text-xs text-gray-500">Загружено: {currentDateTime}</p>
        </div>

        <div className="flex gap-2 mt-4">
          <Link
            href={`/product/${slug}`}
            className="flex-1 bg-red-600 text-white text-center py-2 px-4 rounded hover:bg-red-700 transition-colors"
            aria-disabled={isOutOfStock}
          >
            Купить
          </Link>

          <button
            type="button"
            onClick={handleAddToCart}
            // disabled={isOutOfStock}
            className={`flex-1 text-white py-2 px-4 rounded transition-colors disabled:bg-gray-400 ${
              isAddedToCart ? "bg-gray-600" : "bg-green-600 hover:bg-green-700"
            } ${isAnimating ? "scale-105" : "scale-100"} transition-transform`}
          >
            {isAddedToCart ? "Добавлено" : "В корзину"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCardClient;
