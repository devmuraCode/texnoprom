import BrandCatalogClient from "./BrandCatalogClient";

export default function BrandCatalogPage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Бренд: {params.slug}</h1>
      <BrandCatalogClient slug={params.slug} />
    </div>
  );
}
