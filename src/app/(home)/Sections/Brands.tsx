import { getBrands } from "@/app/server/brands";
import Slider from "@/components/ClientSlider/Slider";
import type { IBrand } from "@/shared/types/brands";

export const Brands = async () => {
  let brands: IBrand[] = [];
  let error: Error | null = null;

  try {
    brands = await getBrands();
  } catch (err) {
    error = err instanceof Error ? err : new Error("Failed to fetch brands");
  }

  if (error) {
    return (
      <div className="container mx-auto py-16 text-center text-red-600">
        Ошибка загрузки брендов: {error.message}
      </div>
    );
  }

  if (!Array.isArray(brands) || brands.length === 0) {
    return (
      <div className="container mx-auto py-16 text-center text-gray-500">
        Нет брендов
      </div>
    );
  }

  return (
    <div className="container mx-auto py-16">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Бренды</h2>
      <Slider
        items={brands.map((brand) => ({
          id: brand.id,
          title: brand.title,
          slug: brand.slug,
          img: brand.logo,
          link: `/brand/${brand.slug}`,
        }))}
        slidesPerView={6}
      />
    </div>
  );
};

export default Brands;
