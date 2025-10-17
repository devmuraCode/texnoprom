"use client"

import { getHitProduct } from "@/app/server/hitproduct";
import ProductCard from "@/components/ProductCard/ProductCard";
import type { IHitProductResponse, IProduct } from "@/shared/types/product";
import { useQuery } from "@tanstack/react-query";

export const BestSallers = () => {
  const {
    data: hitProductResponse,
    isLoading,
    error,
  } = useQuery<IHitProductResponse>({
    queryKey: ["hitProducts"],
    queryFn: getHitProduct,
  });

  if (isLoading) {
    return <div className="text-center py-10 text-gray-600">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-600">
        Error loading best sellers
      </div>
    );
  }

  const productItems = hitProductResponse?.products || [];

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Лучшие предложения
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {productItems.map((product) => (
          <ProductCard
            key={product.id}
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
          />
        ))}
      </div>
      {productItems.length === 0 && (
        <p className="text-center text-gray-500">No best sellers available.</p>
      )}
    </div>
  );
};

export default BestSallers;
