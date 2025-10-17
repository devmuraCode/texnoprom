"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

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
  const lastUpdated = updated_at
    ? new Date(updated_at).toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : null;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-white relative">
      {discount_percent && parseFloat(discount_percent) > 0 && (
        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
          -{discount_percent}%
        </div>
      )}

      <div className="relative w-full h-72">
        <Image
          src={mainimg}
          alt={title}
          fill
          className="object-contain"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" 
        />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
          {title}
        </h3>
        <div className="mt-2">
          {discounted_price && discounted_price < parseFloat(price) && (
            <div className="flex items-center gap-2">
              <span className="text-red-600 text-xl font-bold">
                {discounted_price.toLocaleString()} сум
              </span>
              <span className="text-gray-500 line-through">
                {parseFloat(price).toLocaleString()} сум
              </span>
            </div>
          )}
          {!discounted_price && (
            <span className="text-gray-800 text-xl font-bold">
              {parseFloat(price).toLocaleString()} сум
            </span>
          )}
        </div>
        {installment && (
          <p className="text-sm text-gray-600 mt-1">
            Рассрочка: {installment.toLocaleString()} сум/мес
          </p>
        )}
        {stock_quantity !== undefined && stock_quantity <= 0 && (
          <p className="text-sm text-red-600 mt-1">Нет в наличии</p>
        )}
        {lastUpdated && (
          <p className="text-xs text-gray-500 mt-1">Обновлено: {lastUpdated}</p>
        )}
      </div>
      <div className="p-4 pt-0">
        <Link
          href={`/product/${slug}`}
          className="w-full inline-block bg-red-600 text-white text-center py-2 rounded hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          aria-disabled={stock_quantity !== undefined && stock_quantity <= 0}
        >
          Купить
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;