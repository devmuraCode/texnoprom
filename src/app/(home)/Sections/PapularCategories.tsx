"use client";
import { getPapularCategory } from "@/app/server/papularcategory";
import type { IPapularCategory } from "@/shared/types/papularcategorytype";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";

export const PapularCategories = () => {
  const {
    data: papularCategories,
    isLoading: isCategoryLoading,
    error: categoryError,
  } = useQuery<IPapularCategory[]>({
    queryKey: ["papularcategories"],
    queryFn: getPapularCategory,
  });

  console.log("Popular Categories:", papularCategories);

  return (
    <div className="container mx-auto py-16">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Популярные категории
      </h2>
      {isCategoryLoading ? (
        <div>Loading popular categories...</div>
      ) : categoryError ? (
        <div>Error loading popular categories</div>
      ) : !Array.isArray(papularCategories) ||
        papularCategories.length === 0 ? (
        <div>No popular categories available</div>
      ) : (
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={20}
          slidesPerView={6}
          className="w-full max-w-7xl m-0"
          autoplay={{
            delay: 1500,
            disableOnInteraction: false,
          }}
        >
          {papularCategories.map((cat) => (
            <SwiperSlide
              key={cat.id}
              className="flex justify-center items-center"
            >
              <Link
                href={`/category/${cat.slug}`}
                className="text-gray-600 hover:text-red-600 text-sm font-medium py-2 transition-colors duration-200"
              >
                <Image
                  src={cat.img}
                  alt={cat.title}
                  width={100}
                  height={100}
                  className="w-12 h-12"
                />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default PapularCategories;
