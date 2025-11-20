import { notFound } from "next/navigation";
import type {
  IProduct,
  ICharacteristic,
  IProductPhotos,
} from "@/shared/types/product";
import { Suspense } from "react";
import Image from "next/image";
import ProductCardClient from "@/components/ProductCard/ProductCardClient";
import {
  getCharacteristics,
  getPhotos,
  getProduct,
} from "@/server/getProductDetailBySlug";

export default async function ProductDetail({
  params,
}: {
  params: { slug: string };
}) {
  let product: IProduct | null = null;
  let characteristics: ICharacteristic[] = [];
  let photos: IProductPhotos[] = [];
  let error: Error | null = null;

  try {
    const { slug } = await params;
    [product, characteristics, photos] = await Promise.all([
      getProduct(slug),
      getCharacteristics(slug),
      getPhotos(slug),
    ]);
  } catch (err) {
    error = err instanceof Error ? err : new Error("Unknown error");
  }

  if (error || !product) {
    notFound();
  }

  const currentDateTime = new Date().toLocaleString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZoneName: "short",
  });

  return (
    <Suspense fallback={<div className="text-center py-10">Загрузка...</div>}>
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
          {product.title}
        </h1>

        {/* === Главный flex-контейнер: галерея + карточка === */}
        <div className="flex justify-between flex-col lg:flex-row gap-6 lg:gap-8 mb-10">
          {/* === Галерея (левая часть) === */}
          <div className="w-full">
            <div className="grid grid-cols-1 gap-4">
              {/* Главное фото */}
              <div className="relative w-full h-64 sm:h-80 lg:h-96 bg-white rounded-lg shadow-sm overflow-hidden">
                <Image
                  src={product.mainimg}
                  alt={product.title}
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  priority
                />
              </div>

              {/* Миниатюры */}
              {photos.length > 0 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {photos.map((photo) => (
                    <div
                      key={photo.id}
                      className="relative w-full h-20 bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:ring-2 hover:ring-red-500 transition-all"
                    >
                      <Image
                        src={photo.img}
                        alt="Доп. фото"
                        fill
                        className="object-contain p-2"
                        sizes="15vw"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* === Карточка с рассрочкой (правая часть) === */}
          <div className="w-full">
            <ProductCardClient
              id={product.id}
              title={product.title}
              mainimg={product.mainimg}
              price={product.price}
              discounted_price={product.discounted_price}
              installment={product.installment}
              slug={product.slug}
              discount_percent={product.discount_percent}
              stock_quantity={product.stock_quantity}
              updated_at={product.updated_at}
              currentDateTime={currentDateTime}
            />
          </div>
        </div>

        {/* === Характеристики === */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-2">
            Характеристики
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-700">
            {characteristics.map((char, index) => (
              <li key={index} className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-900">
                  {char.name}
                </span>
                <span className="text-sm text-gray-600">{char.value}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* === Описание === */}
        {product.description && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Описание
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>
        )}
      </div>
    </Suspense>
  );
}
