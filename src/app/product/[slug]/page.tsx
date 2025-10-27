import { notFound } from "next/navigation";
import type {
  IProduct,
  ICharacteristic,
  IProductPhotos,
} from "@/shared/types/product";
import { Suspense } from "react";
import Image from "next/image";
import type { IInstallment } from "@/shared/types/instalment";
import {
  getCharacteristics,
  getPhotos,
  getProduct,
} from "@/server/getProductDetailBySlug";
import { getInstallment } from "@/server/getInstalment";
import Link from "next/link";
import ProductCardClient from "@/components/ProductCard/ProductCardClient";

export default async function ProductDetail({
  params,
}: {
  params: { slug: string };
}) {
  let product: IProduct | null = null;
  let characteristics: ICharacteristic[] = [];
  let photos: IProductPhotos[] = [];
  let installments: IInstallment[] = [];
  let error: Error | null = null;

  try {
    const { slug } = await params;
    [product, characteristics, photos] = await Promise.all([
      getProduct(slug),
      getCharacteristics(slug),
      getPhotos(slug),
    ]);
    installments = await getInstallment(product.id, 12);
  } catch (err) {
    error = err instanceof Error ? err : new Error("Unknown error");
  }

  if (error || !product) {
    notFound();
  }

  const selectedInstallment = installments.length > 0 ? installments[0] : null;
  const currentDateTime = "06:43 PM +05, Monday, October 27, 2025";

  return (
    <Suspense fallback={<div className="text-center py-10">Загрузка...</div>}>
      <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          {product.title}
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-3 relative w-full h-96">
            <Image
              src={product.mainimg}
              alt={product.title}
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 75vw"
            />
          </div>
          <div className="lg:col-span-1 grid grid-cols-1 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="relative w-full h-24">
                <Image
                  src={photo.img}
                  alt={`${product.title} - дополнительное фото`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 25vw"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="mb-8">
          <ProductCardClient
            id={product.id}
            title={product.title}
            price={product.price}
            discounted_price={product.discounted_price}
            installment={product.installment}
            slug={product.slug}
            discount_percent={product.discount_percent}
            stock_quantity={product.stock_quantity}
            updated_at={product.updated_at}
            selectedInstallment={selectedInstallment}
            currentDateTime={currentDateTime}
          />
        </div>

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