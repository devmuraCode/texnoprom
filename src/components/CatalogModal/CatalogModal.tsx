"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";
import { FaAngleDown } from "react-icons/fa6";
import { X } from "lucide-react";
import { getCollections } from "@/server/collections";
import { useCatalogStore } from "@/store/catalogStore";
import { getCategoriesByCollection } from "@/server/getCategoriesByCollection";
import { Accordion } from "../Accordion";

const ITEMS_PER_LOAD = 5;

type Collection = {
  id: string;
  title: string;
  slug: string;
  priority: number;
  img: string | null;
};

export default function CatalogModal() {
  const {
    isOpen,
    closeCatalog,
    selectedSlug,
    setSelectedSlug,
    categoriesBySlug,
    setCategoriesForSlug,
  } = useCatalogStore();

  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const [collections, setCollections] = useState<Collection[]>([]);
  const [loadingCollections, setLoadingCollections] = useState(false);
  const [collectionsError, setCollectionsError] = useState<string | null>(null);

  const [activeMobileSlug, setActiveMobileSlug] = useState<string>("");

  const [loadingCategoriesSlug, setLoadingCategoriesSlug] = useState<
    string | null
  >(null);
  const [categoriesErrorSlug, setCategoriesErrorSlug] = useState<string | null>(
    null
  );

  const [visibleItems, setVisibleItems] = useState<Record<string, number>>({});

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && closeCatalog();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closeCatalog]);
  useEffect(() => {
    if (!isOpen) return;
    if (collections.length > 0) return;

    let cancelled = false;

    (async () => {
      try {
        setLoadingCollections(true);
        setCollectionsError(null);

        const data = await getCollections();
        const sorted = [...data].sort((a, b) => a.priority - b.priority);

        if (!cancelled) setCollections(sorted);
      } catch (e) {
        if (!cancelled) setCollectionsError("Не удалось загрузить коллекции");
      } finally {
        if (!cancelled) setLoadingCollections(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isOpen, collections.length]);
  useEffect(() => {
    if (!isOpen) return;
    if (collections.length === 0) return;

    if (isMobile) {
      if (!activeMobileSlug) {
        setActiveMobileSlug(collections[0].slug);
      }
      if (!selectedSlug) {
        setSelectedSlug(collections[0].slug);
      }
    } else {
      if (!selectedSlug) {
        setSelectedSlug(collections[0].slug);
      }
    }
  }, [
    isOpen,
    isMobile,
    collections,
    activeMobileSlug,
    selectedSlug,
    setSelectedSlug,
  ]);
  useEffect(() => {
    if (!isOpen) return;
    if (!selectedSlug) return;
    if (categoriesBySlug[selectedSlug]) return;

    let cancelled = false;

    (async () => {
      try {
        setLoadingCategoriesSlug(selectedSlug);
        setCategoriesErrorSlug(null);

        const cats = await getCategoriesByCollection(selectedSlug);
        if (!cancelled) setCategoriesForSlug(selectedSlug, cats);
      } catch (e) {
        if (!cancelled) setCategoriesErrorSlug(selectedSlug);
      } finally {
        if (!cancelled) setLoadingCategoriesSlug(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isOpen, selectedSlug, categoriesBySlug, setCategoriesForSlug]);

  const categories = useMemo(() => {
    if (!selectedSlug) return undefined;
    return categoriesBySlug[selectedSlug];
  }, [selectedSlug, categoriesBySlug]);

  useEffect(() => {
    if (!categories) return;
    const initial: Record<string, number> = {};
    for (const c of categories) initial[c.category_id] = ITEMS_PER_LOAD;
    setVisibleItems(initial);
  }, [categories]);

  const handleShowMore = (categoryId: string) => {
    setVisibleItems((prev) => ({
      ...prev,
      [categoryId]: (prev[categoryId] ?? ITEMS_PER_LOAD) + ITEMS_PER_LOAD,
    }));
  };

  const handleShowLess = (categoryId: string) => {
    setVisibleItems((prev) => ({
      ...prev,
      [categoryId]: ITEMS_PER_LOAD,
    }));
  };

  const renderBrandsList = (category: any) => {
    const list = Array.isArray(category?.children) ? category.children : [];
    const limit = visibleItems[category.category_id] ?? ITEMS_PER_LOAD;
    const visibleBrands = list.slice(0, limit);

    const hasMore = list.length > limit;
    const isExpanded = limit > ITEMS_PER_LOAD;

    if (list.length === 0) return null;

    return (
      <>
        <ul className="space-y-1">
          {visibleBrands.map((brand: any) => (
            <li key={brand.brand_id}>
              <Link
                href={`/catalog/${brand.brand_slug}`}
                onClick={closeCatalog}
                className="block py-1 text-gray-700 hover:text-black"
              >
                {brand.brand_title}
              </Link>
            </li>
          ))}
        </ul>

        {hasMore && (
          <button
            type="button"
            onClick={() => handleShowMore(category.category_id)}
            className="mt-2 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black"
          >
            Еще <FaAngleDown />
          </button>
        )}

        {isExpanded && (
          <button
            type="button"
            onClick={() => handleShowLess(category.category_id)}
            className="mt-2 block text-sm text-gray-600 hover:text-black"
          >
            Свернуть
          </button>
        )}
      </>
    );
  };

  const handleMobilePanelChange = (slug: string) => {
    setActiveMobileSlug(slug);
    if (slug) setSelectedSlug(slug);
  };

  if (!isOpen) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Закрыть каталог"
        onClick={closeCatalog}
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
      />
      <section
        className="
          fixed inset-0 z-50 bg-white shadow-2xl
          md:left-0 md:top-0 md:h-full md:w-full md:max-w-[980px]
        "
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between border-b px-4 md:px-6 py-4 md:py-5">
          <h2 className="text-xl md:text-2xl font-bold">Каталог</h2>
          <button
            type="button"
            onClick={closeCatalog}
            className="rounded-md p-2 hover:bg-gray-100"
            aria-label="Закрыть"
          >
            <X className="h-6 w-6 md:h-7 md:w-7" />
          </button>
        </div>
        <div className="h-[calc(100%-64px)] md:h-[calc(100%-76px)]">
          <div className="flex h-full">
            <aside
              className="
                w-full md:w-[320px] border-r md:border-r
                p-4 overflow-y-auto
              "
            >
              {loadingCollections && (
                <div className="text-gray-500">Загрузка...</div>
              )}
              {collectionsError && (
                <div className="text-red-600">{collectionsError}</div>
              )}

              {!loadingCollections && !collectionsError && (
                <>
                  {isMobile ? (
                    <Accordion
                      activeKey={activeMobileSlug}
                      onChange={handleMobilePanelChange}
                      items={collections.map((c) => ({
                        key: c.slug,
                        label: c.title,
                        children: (
                          <MobileCategories
                            activeKey={activeMobileSlug} // ✅ ВАЖНО
                            slug={c.slug}
                            categoriesBySlug={categoriesBySlug}
                            loadingSlug={loadingCategoriesSlug}
                            errorSlug={categoriesErrorSlug}
                            closeCatalog={closeCatalog}
                            renderBrandsList={renderBrandsList}
                          />
                        ),
                      }))}
                    />
                  ) : (
                    <ul className="space-y-1">
                      {collections.map((c) => (
                        <li key={c.id}>
                          <button
                            type="button"
                            onClick={() => setSelectedSlug(c.slug)}
                            className={[
                              "w-full rounded-lg px-3 py-2 text-left",
                              selectedSlug === c.slug
                                ? "bg-gray-100 font-semibold"
                                : "hover:bg-gray-50",
                            ].join(" ")}
                          >
                            {c.title}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </aside>
            {!isMobile && (
              <main className="flex-1 overflow-y-auto p-6">
                {!selectedSlug && (
                  <div className="text-gray-500">Выберите коллекцию</div>
                )}

                {selectedSlug && loadingCategoriesSlug === selectedSlug && (
                  <div className="text-gray-500">Загрузка категорий...</div>
                )}

                {selectedSlug && categoriesErrorSlug === selectedSlug && (
                  <div className="text-red-600">
                    Не удалось загрузить категории
                  </div>
                )}

                {selectedSlug && categories && (
                  <div className="grid grid-cols-3 gap-8">
                    {categories.map((category: any) => (
                      <div key={category.category_id}>
                        <Link
                          href={`/catalog/${category.category_slug}`}
                          onClick={closeCatalog}
                          className="mb-3 block text-lg font-semibold"
                        >
                          {category.category_title}
                        </Link>
                        {renderBrandsList(category)}
                      </div>
                    ))}
                  </div>
                )}
              </main>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function MobileCategories({
  activeKey,
  slug,
  categoriesBySlug,
  loadingSlug,
  errorSlug,
  closeCatalog,
  renderBrandsList,
}: any) {
  if (activeKey !== slug) return null;

  const categories = categoriesBySlug[slug];

  if (loadingSlug === slug)
    return <div className="text-gray-500">Загрузка...</div>;
  if (errorSlug === slug)
    return <div className="text-red-600">Ошибка загрузки</div>;
  if (!categories) return null;

  return (
    <div className="space-y-6 pt-3">
      {categories.map((category: any) => (
        <div key={category.category_id}>
          <Link
            href={`/catalog/${category.category_slug}`}
            onClick={closeCatalog}
            className="mb-2 block text-base font-semibold"
          >
            {category.category_title}
          </Link>
          {renderBrandsList(category)}
        </div>
      ))}
    </div>
  );
}
