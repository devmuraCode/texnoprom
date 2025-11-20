"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useInstallment } from "@/server/useInstallment";

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

  // Состояние выбора срока
  const [selectedMonths, setSelectedMonths] = useState(12);

  // Динамический запрос рассрочки
  const { data: installments = [], isLoading } = useInstallment({
    productId: id,
    months: selectedMonths,
  });

  // Выбранный сервис рассрочки
  const [selectedService, setSelectedService] = useState<{
    title: string;
    monthly_payment: number;
  } | null>(null);

  useEffect(() => {
    if (installments.length > 0) {
      setSelectedService({
        title: installments[0].title,
        monthly_payment: installments[0].monthly_payment,
      });
    }
  }, [installments]);

  // Сроки рассрочки
  const monthsOptions = [3, 6, 9, 12, 15, 18, 24];

  const formatPrice = (value: number) => value.toLocaleString("ru-RU") + " сум";

  return (
    <div className="flex sm:flex-row transition-shadow duration-300 w-full mx-auto">
      <div className="p-4 sm:p-6 w-full  flex flex-col justify-between">
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
            {title}
          </h3>
          <div className="mb-4">
            {discounted_price && discounted_price < parseFloat(price) ? (
              <div className="flex items-center gap-2">
                <span className="text-red-600 text-xl sm:text-2xl font-bold">
                  {discounted_price.toLocaleString()} сум
                </span>
                <span className="text-gray-500 line-through text-sm">
                  {parseFloat(price).toLocaleString()} сум
                </span>
                {discount_percent && parseFloat(discount_percent) > 0 && (
                  <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                    -{discount_percent}%
                  </span>
                )}
              </div>
            ) : (
              <span className="text-gray-800 text-xl sm:text-2xl font-bold">
                {parseFloat(price).toLocaleString()} сум
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
                    name="installment-months"
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
            ) : installments.length > 0 ? (
              <div className="space-y-2">
                {installments.map((inst) => (
                  <div
                    key={inst.id}
                    onClick={() =>
                      setSelectedService({
                        title: inst.title,
                        monthly_payment: inst.monthly_payment,
                      })
                    }
                    className={`flex items-center justify-between p-2 border rounded cursor-pointer transition-colors ${
                      selectedService?.title === inst.title
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
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Рассрочка недоступна</p>
            )}
          </div>

          {/* Наличие */}
          {stock_quantity !== undefined && stock_quantity <= 0 && (
            <p className="text-sm text-red-600 mb-2">Нет в наличии</p>
          )}

          {/* Даты */}
          {lastUpdated && (
            <p className="text-xs text-gray-500">Обновлено: {lastUpdated}</p>
          )}
          <p className="text-xs text-gray-500">Загружено: {currentDateTime}</p>
        </div>

        {/* Кнопки */}
        <div className="flex gap-2 mt-4">
          <Link
            href={`/product/${slug}`}
            className="flex-1 bg-red-600 text-white text-center py-2 px-4 rounded hover:bg-red-700 transition-colors disabled:bg-gray-400"
            aria-disabled={stock_quantity !== undefined && stock_quantity <= 0}
          >
            Купить
          </Link>
          <button
            disabled={
              (stock_quantity !== undefined && stock_quantity <= 0) ||
              !selectedService
            }
            onClick={() => {
              console.log("Добавлено в корзину:", {
                productId: id,
                title,
                price,
                installmentMonths: selectedMonths,
                installmentService: selectedService,
              });
              // Здесь можно вызвать addToCart из Redux или API
            }}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors disabled:bg-gray-400"
          >
            В корзину
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCardClient;
