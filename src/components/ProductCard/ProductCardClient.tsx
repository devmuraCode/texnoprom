"use client";
import Link from "next/link";
import type { IInstallment } from "@/shared/types/instalment";

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
  selectedInstallment?: IInstallment;
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
  selectedInstallment,
  currentDateTime,
}) => {
  const lastUpdated = updated_at
    ? new Date(updated_at).toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : null;

  return (
    <div className="flex flex-col sm:flex-row border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-white relative w-full max-w-4xl mx-auto">
      <div className="p-4 sm:p-6 w-full sm:w-1/2">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
          {title}
        </h3>
        <div className="mb-4">
          {discounted_price && discounted_price < parseFloat(price) ? (
            <div className="flex items-center gap-2">
              <span className="text-red-600 text-xl sm:text-2xl font-bold">
                {discounted_price.toLocaleString()} сум
              </span>
              <span className="text-gray-500 line-through text-sm sm:text-base">
                {parseFloat(price).toLocaleString()} сум
              </span>
              {discount_percent && parseFloat(discount_percent) > 0 && (
                <span className="bg-red-600 text-white text-xs sm:text-sm font-bold px-2 py-1 rounded">
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
          <p className="text-sm text-gray-600">
            Рассрочка (12 месяцев):{" "}
            {selectedInstallment ? (
              <span className="text-green-600 font-bold">
                {selectedInstallment.monthly_payment.toLocaleString()} сум/мес
              </span>
            ) : installment ? (
              <span>{installment.toLocaleString()} сум/мес</span>
            ) : (
              <span>Не доступна</span>
            )}
          </p>
       
        </div>
        {stock_quantity !== undefined && stock_quantity <= 0 && (
          <p className="text-sm text-red-600 mb-2">Нет в наличии</p>
        )}
        {lastUpdated && (
          <p className="text-xs text-gray-500 mb-2">Обновлено: {lastUpdated}</p>
        )}
        <p className="text-xs text-gray-500 mb-2">
          Загружено: {currentDateTime}
        </p>
        <div className="flex gap-2">
          <Link
            href={`/product/${slug}`}
            className="w-full sm:w-auto flex-1 bg-red-600 text-white text-center py-2 px-4 rounded hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            aria-disabled={stock_quantity !== undefined && stock_quantity <= 0}
          >
            Купить
          </Link>
          <button
            disabled={stock_quantity !== undefined && stock_quantity <= 0}
            className="w-full sm:w-auto flex-1 bg-green-600 text-white text-center py-2 px-4 rounded hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={() => console.log(`Добавлено в корзину: ${title}`)}
          >
            В корзину
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCardClient;
