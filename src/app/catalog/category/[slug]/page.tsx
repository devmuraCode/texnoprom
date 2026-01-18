import CategoryCatalogClient from "./CategoryCatalogClient";

export default function CategoryCatalogPage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Категория: {params.slug}</h1>
      <CategoryCatalogClient slug={params.slug} />
    </div>
  );
}
