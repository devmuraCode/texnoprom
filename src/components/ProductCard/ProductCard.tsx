"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";

interface ProductCardProps {
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
}

const ProductCard: React.FC<ProductCardProps> = ({
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
}) => {
  const addToCart = useCartStore((s) => s.addToCart);

  const lastUpdated = updated_at
    ? new Date(updated_at).toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : null;

  const basePrice = useMemo(() => Number(price) || 0, [price]);
  const hasDiscount =
    typeof discounted_price === "number" &&
    discounted_price > 0 &&
    discounted_price < basePrice;

  const finalPrice = hasDiscount ? discounted_price! : basePrice;

  // если хочешь включить — разкомментируй
  // const isOutOfStock = typeof stock_quantity === "number" && stock_quantity <= 0;

  const handleAddToCart = () => {
    // if (isOutOfStock) return;

    addToCart(
      {
        id,
        title,
        price: finalPrice,
        image: mainimg,
      },
      1
    );
  };

  return (
    <article
      className="
        group relative overflow-hidden rounded-xl border border-gray-200 bg-white
        shadow-sm transition-all duration-200 hover:shadow-lg
      "
    >
      {/* badge */}
      {discount_percent && parseFloat(discount_percent) > 0 && (
        <div
          className="
            absolute left-2 top-2 z-10 rounded-md bg-red-600 px-2 py-1
            text-[11px] font-bold text-white sm:left-3 sm:top-3 sm:text-xs
          "
        >
          -{discount_percent}%
        </div>
      )}

      {/* image */}
      <Link href={`/product/${slug}`} className="block">
        <div
          className="
            relative w-full bg-gray-50
            h-44 sm:h-52 md:h-60 lg:h-72
          "
        >
          <Image
            src={mainimg}
            alt={title}
            fill
            className="object-contain p-3 transition-transform duration-200 group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>
      </Link>

      {/* content */}
      <div className="p-3 sm:p-4">
        <Link href={`/product/${slug}`} className="block">
          <h3
            className="
              text-sm sm:text-base font-semibold text-gray-800
              line-clamp-2 leading-snug
              group-hover:text-red-600 transition-colors
            "
            title={title}
          >
            {title}
          </h3>
        </Link>

        {/* price */}
        <div className="mt-2">
          {hasDiscount ? (
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="text-lg sm:text-xl font-bold text-red-600">
                {finalPrice.toLocaleString()} сум
              </span>
              <span className="text-xs sm:text-sm text-gray-500 line-through">
                {basePrice.toLocaleString()} сум
              </span>
            </div>
          ) : (
            <span className="text-lg sm:text-xl font-bold text-gray-800">
              {basePrice.toLocaleString()} сум
            </span>
          )}
        </div>

        {/* installment */}
        {installment ? (
          <p className="mt-1 text-xs sm:text-sm text-gray-600">
            Рассрочка: {installment.toLocaleString()} сум/мес
          </p>
        ) : (
          <div className="h-4 sm:h-5" />
        )}

        {/* updated */}
        {lastUpdated && (
          <p className="mt-1 text-[11px] sm:text-xs text-gray-500">
            Обновлено: {lastUpdated}
          </p>
        )}
      </div>

      {/* actions */}
      <div className="px-3 pb-3 sm:px-4 sm:pb-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <Link
            href={`/product/${slug}`}
            className="
              inline-flex w-full items-center justify-center rounded-md
              bg-red-600 px-3 py-2 text-sm font-semibold text-white
              hover:bg-red-700 active:bg-red-800 transition-colors
            "
          >
            Купить
          </Link>

          <button
            type="button"
            onClick={handleAddToCart}
            className="
              inline-flex w-full items-center justify-center rounded-md
              bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700
              hover:bg-gray-200 active:bg-gray-300 transition-colors
            "
          >
            В корзину
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
