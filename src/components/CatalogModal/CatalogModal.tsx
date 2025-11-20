"use client";

import { getCollections } from "@/server/collections";
import { useCatalogStore } from "@/store/catalogStore";
import { X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export interface ICollections {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  slug: string;
  priority: number;
  img: string | null;
}

export default function CatalogModal() {
  const { isOpen, closeCatalog } = useCatalogStore();

  const [collections, setCollections] = useState<ICollections[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    if (collections.length > 0) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCollections();
        const sorted = data.sort((a, b) => a.priority - b.priority);

        if (!cancelled) {
          setCollections(sorted);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Не удалось загрузить категории");
          console.error("Catalog load error:", err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [isOpen, collections.length]);

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

  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={closeCatalog}
        className="fixed inset-0 bg-black/40 transition-opacity duration-300 z-40"
      />
      <div className="fixed left-0 top-0 z-50 flex h-full w-full max-w-[420px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out translate-x-0">
        <div className="flex items-center justify-between border-b px-6 py-5">
          <h2 className="text-2xl font-bold">Каталог</h2>
          <button
            onClick={closeCatalog}
            className="rounded-full p-2 hover:bg-gray-100 transition"
          >
            <X className="h-7 w-7" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {loading && (
            <div className="space-y-3">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="h-12 animate-pulse rounded-lg bg-gray-100"
                />
              ))}
            </div>
          )}

          {error && (
            <div className="py-10 text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => setCollections([])}
                className="text-sm underline text-blue-600"
              >
                Попробовать снова
              </button>
            </div>
          )}

          {!loading && !error && collections.length === 0 && (
            <p className="py-10 text-center text-gray-500">
              Категории не найдены
            </p>
          )}

          {!loading && collections.length > 0 && (
            <div className="space-y-1">
              {collections.map((collection) => (
                <Link
                  key={collection.id}
                  href={`/catalog/${collection.slug}`}
                  onClick={closeCatalog}
                  className="flex items-center gap-4 rounded-lg px-4 py-3.5 text-lg font-medium text-gray-800 transition hover:bg-gray-50 group"
                >
                  {collection.img ? (
                    <img
                      src={collection.img}
                      alt={collection.title}
                      className="h-8 w-8 rounded object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded bg-gray-200" />
                  )}
                  <span>{collection.title}</span>
                  <svg
                    className="ml-auto h-5 w-5 text-gray-400 group-hover:text-gray-600 transition"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
