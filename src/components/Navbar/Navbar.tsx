"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import logo from "@/assets/logo.png";
import { useQuery } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Category } from "@/shared/types/category";
import { getCategories } from "@/server/categories";
import { Search, ShoppingCart, User, LogIn, Menu, X } from "lucide-react";
import { Navigation, Autoplay } from "swiper/modules";
import { useCatalogStore } from "@/store/catalogStore";
import useRegisterModal from "@/hooks/useRegisterModal";
const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { openCatalog } = useCatalogStore();
  const registerModal = useRegisterModal();

  const query = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const categories = useMemo(() => query.data ?? [], [query.data]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search query:", searchQuery);
  };

  useEffect(() => {
    if (!isMenuOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur border-b border-gray-100">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className="inline-flex md:hidden items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100"
              aria-label="Открыть меню"
            >
              <Menu size={22} />
            </button>

            <Link href="/" className="flex items-center gap-2">
              <Image
                src={logo}
                alt="Texnoprom"
                className="h-10 w-auto"
                priority
              />
            </Link>

            <button
              onClick={openCatalog}
              className="hidden md:inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 active:bg-red-800"
            >
              Каталог
            </button>
          </div>

          <form
            onSubmit={handleSearch}
            className="hidden md:block w-full max-w-xl"
          >
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Поиск товаров"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-400"
              />
            </div>
          </form>

          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/cart"
              className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-red-600"
              aria-label="Корзина"
            >
              <ShoppingCart size={20} />
              <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[11px] font-semibold text-white">
                0
              </span>
            </Link>

            <Link
              href="/profile"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-red-600"
              aria-label="Профиль"
            >
              <User size={20} />
            </Link>

            <button
              onClick={registerModal.onOpen}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-red-600"
              aria-label="Вход / Регистрация"
              type="button"
            >
              <LogIn size={20} />
            </button>
          </div>
        </div>

        <div className="md:hidden pb-3">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Поиск товаров"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-400"
              />
            </div>
          </form>
        </div>

        <div className="hidden md:block border-t border-gray-100">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={8}
            slidesPerView={6}
            className="w-full"
            autoplay={{ delay: 1600, disableOnInteraction: false }}
            breakpoints={{
              768: { slidesPerView: 5 },
              1024: { slidesPerView: 7 },
              1280: { slidesPerView: 8 },
            }}
          >
            {categories.map((cat) => (
              <SwiperSlide key={cat.id} className="!w-auto">
                <Link
                  href={`/catalog/category/${cat.slug}`}
                  className="inline-flex h-12 items-center whitespace-nowrap px-3 text-sm font-medium text-gray-600 hover:text-red-600"
                >
                  {cat.title}
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* overlay */}
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Закрыть меню"
            onClick={() => setIsMenuOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-[84%] max-w-sm bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4">
              <div className="flex items-center gap-2">
                <Image src={logo} alt="Texnoprom" className="h-9 w-auto" />
              </div>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-md p-2 text-gray-700 hover:bg-gray-100"
                aria-label="Закрыть"
              >
                <X size={22} />
              </button>
            </div>

            <div className="px-4 py-4 bg-white w-full">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  openCatalog();
                }}
                className="w-full rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Каталог
              </button>

              <div className="mt-4 space-y-1">
                <Link
                  href="/cart"
                  onClick={() => setIsMenuOpen(false)}
                  className="block rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-red-600"
                >
                  Корзина
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="block rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-red-600"
                >
                  Профиль
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    registerModal.onOpen();
                  }}
                  className="w-full text-left rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-red-600"
                >
                  Вход / Регистрация
                </button>
              </div>

              {categories.length > 0 && (
                <div className="mt-5 z-10 bg-white">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Категории
                  </p>
                  <div className="max-h-[45vh] overflow-auto rounded-md border border-gray-100">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/catalog/category/${cat.slug}`}
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600"
                      >
                        {cat.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </header>
  );
};

export default Navbar;
