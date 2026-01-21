"use client";

import React, { useMemo, useState } from "react";
import { useProductsByBrand } from "@/features/products/useProducts";
import ProductCard from "@/components/ProductCard/ProductCard";

function toNumberPrice(price: string | number | undefined) {
  if (price == null) return 0;
  if (typeof price === "number") return price;
  const n = Number(String(price).replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

function formatUZS(n: number) {
  return Math.round(n).toLocaleString("ru-RU");
}

export default function BrandCatalogClient({ slug }: { slug: string }) {
  const { data, isLoading, isError } = useProductsByBrand(slug);
  const products = data?.results ?? [];
  const { minAll, maxAll } = useMemo(() => {
    if (products.length === 0) return { minAll: 0, maxAll: 0 };
    const prices = products
      .map((p) => toNumberPrice(p.price))
      .filter((n) => n > 0);
    if (prices.length === 0) return { minAll: 0, maxAll: 0 };
    return { minAll: Math.min(...prices), maxAll: Math.max(...prices) };
  }, [products]);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const filtered = useMemo(() => {
    const minV = minPrice ?? minAll;
    const maxV = maxPrice ?? maxAll;

    return products.filter((p) => {
      const pr = toNumberPrice(p.price);
      if (pr < minV) return false;
      if (pr > maxV) return false;
      if (onlyInStock && (p.stock_quantity ?? 0) <= 0) return false;
      return true;
    });
  }, [products, minPrice, maxPrice, minAll, maxAll, onlyInStock]);

  const reset = () => {
    setMinPrice(null);
    setMaxPrice(null);
    setOnlyInStock(false);
  };

  if (isLoading) return <div className="text-gray-500 p-6">Загрузка...</div>;
  if (isError) return <div className="text-red-600 p-6">Ошибка загрузки</div>;
  if (products.length === 0)
    return <div className="text-gray-500 p-6">Товаров нет</div>;

  const minVal = minPrice ?? minAll;
  const maxVal = maxPrice ?? maxAll;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
      <aside className="border rounded-xl p-4 h-fit ">
        <div className="font-semibold text-lg mb-4">Фильтры</div>
        <div className="mb-4">
          <div className="font-medium mb-2">Цена, сум</div>

          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={minPrice ?? ""}
              onChange={(e) =>
                setMinPrice(e.target.value ? Number(e.target.value) : null)
              }
              placeholder={String(Math.round(minAll))}
              className="border rounded-md px-3 py-2 w-full"
            />
            <input
              type="number"
              value={maxPrice ?? ""}
              onChange={(e) =>
                setMaxPrice(e.target.value ? Number(e.target.value) : null)
              }
              placeholder={String(Math.round(maxAll))}
              className="border rounded-md px-3 py-2 w-full"
            />
          </div>
          <div className="mt-3">
            <input
              type="range"
              min={minAll}
              max={maxAll}
              value={minVal}
              onChange={(e) => setMinPrice(Number(e.target.value))}
              className="w-full"
            />
            <input
              type="range"
              min={minAll}
              max={maxAll}
              value={maxVal}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full -mt-1"
            />
            <div className="text-xs text-gray-600 mt-1 flex justify-between">
              <span>{formatUZS(minVal)}</span>
              <span>{formatUZS(maxVal)}</span>
            </div>
          </div>
        </div>
        <div className="mb-4 flex items-center justify-between">
          <div className="font-medium">Только в наличии</div>
          <button
            onClick={() => setOnlyInStock((v) => !v)}
            className={[
              "w-12 h-7 rounded-full transition relative",
              onlyInStock ? "bg-red-600" : "bg-gray-300",
            ].join(" ")}
            aria-pressed={onlyInStock}
          >
            <span
              className={[
                "absolute top-1 w-5 h-5 rounded-full bg-white transition",
                onlyInStock ? "left-6" : "left-1",
              ].join(" ")}
            />
          </button>
        </div>

        <button
          onClick={reset}
          className="w-full border rounded-md py-2 hover:bg-gray-50"
        >
          Сбросить
        </button>

        <div className="text-xs text-gray-500 mt-3">
          Найдено: {filtered.length}
        </div>
      </aside>
      <main>
        {filtered.length === 0 ? (
          <div className="text-gray-500 p-6">По фильтрам ничего не найдено</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {filtered.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                title={p.title}
                slug={p.slug}
                mainimg={p.mainimg}
                price={p.price}
                discounted_price={p.discounted_price}
                installment={p.installment}
                discount_percent={p.discount_percent}
                stock_quantity={p.stock_quantity}
                updated_at={p.updated_at}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
