import { getPapularCategory } from "@/app/server/papularcategory";
import Slider from "@/components/ClientSlider/Slider";
import type { IPapularCategory } from "@/shared/types/papularcategorytype";


export const PapularCategories = async () => {
  let papularCategories: IPapularCategory[] = [];
  let error: Error | null = null;

  try {
    papularCategories = await getPapularCategory();
  } catch (err) {
    error =
      err instanceof Error
        ? err
        : new Error("Failed to fetch popular categories");
  }

  if (error) {
    return (
      <div className="container mx-auto py-16 text-center text-red-600">
        Ошибка загрузки популярных категорий: {error.message}
      </div>
    );
  }

  if (!Array.isArray(papularCategories) || papularCategories.length === 0) {
    return (
      <div className="container mx-auto py-16 text-center text-gray-500">
        Нет популярных категорий
      </div>
    );
  }

  return (
    <div className="container mx-auto py-16">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Популярные категории
      </h2>
      <Slider
        items={papularCategories.map((cat) => ({
          id: cat.id,
          title: cat.title,
          slug: cat.slug,
          img: cat.img,
          link: `/category/${cat.slug}`,
        }))}
        slidesPerView={6}
      />
    </div>
  );
};

export default PapularCategories;
