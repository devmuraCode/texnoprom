import { getBanners } from "@/server/banners";
import { getDayProduct } from "@/server/dayproduct";
import ClientSlider from "@/components/ClientSlider/ClientSlider";
import type { IBanner } from "@/shared/types/banners";
import type { IDayProduct } from "@/shared/types/dayproduct";

export const HeaderSlider = async () => {
  let banners: IBanner[] = [];
  let dayProducts: IDayProduct[] = [];
  let error: Error | null = null;

  try {
    [banners, dayProducts] = await Promise.all([getBanners(), getDayProduct()]);
  } catch (err) {
    error = err instanceof Error ? err : new Error("Failed to fetch data");
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-600">
        Ошибка загрузки данных: {error.message}
      </div>
    );
  }

  const dayProductItems = dayProducts?.[0]?.products || [];

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <ClientSlider banners={banners} dayProductItems={dayProductItems} />
    </div>
  );
};

export default HeaderSlider;
