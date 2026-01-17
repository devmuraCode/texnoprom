import { getProductsByBrandSlug } from "@/server/products";
import Link from "next/link";

export default async function BrandCatalogPage({
  params,
}: {
  params: { slug: string };
}) {
  const products = await getProductsByBrandSlug(params.slug);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Бренд: {params.slug}</h1>

      {products.length === 0 ? (
        <div className="text-gray-500">Товаров нет</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/product/${p.slug}`}
              className="border rounded-lg p-3 hover:shadow"
            >
              <div className="font-semibold">{p.title}</div>
              <div className="text-sm text-gray-600">{p.price}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
