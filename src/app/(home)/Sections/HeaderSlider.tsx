"use client";

import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import type { IBanner } from "@/shared/types/banners";
import { getBanners } from "@/app/server/banners";
import type { IDayProduct } from "@/shared/types/dayproduct";
import { getDayProduct } from "@/app/server/dayproduct";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const HeaderSlider: React.FC = () => {
  const progressCircleBanner = useRef<SVGSVGElement | null>(null);
  const progressContentBanner = useRef<HTMLSpanElement | null>(null);
  const progressCircleDay = useRef<SVGSVGElement | null>(null);
  const progressContentDay = useRef<HTMLSpanElement | null>(null);

  const {
    data: banners,
    isLoading: isBannerLoading,
    error: bannerError,
  } = useQuery<IBanner[]>({
    queryKey: ["banners"],
    queryFn: getBanners,
  });

  const {
    data: dayProducts,
    isLoading: isDayLoading,
    error: dayError,
  } = useQuery<IDayProduct[]>({
    queryKey: ["dayproduct"],
    queryFn: getDayProduct,
  });

  console.log("DayProduct:", dayProducts);

  const onAutoplayTimeLeftBanner = (
    _swiper: any,
    time: number,
    progress: number
  ) => {
    if (progressCircleBanner.current && progressContentBanner.current) {
      progressCircleBanner.current.style.setProperty(
        "--progress",
        `${1 - progress}`
      );
      progressContentBanner.current.textContent = `${Math.ceil(time / 1000)}s`;
    }
  };

  const onAutoplayTimeLeftDay = (
    _swiper: any,
    time: number,
    progress: number
  ) => {
    if (progressCircleDay.current && progressContentDay.current) {
      progressCircleDay.current.style.setProperty(
        "--progress",
        `${1 - progress}`
      );
      progressContentDay.current.textContent = `${Math.ceil(time / 1000)}s`;
    }
  };

  const dayProductItems = dayProducts?.[0]?.products || [];

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Banner Slider */}
        <div className="w-full lg:w-2/3">
          <Swiper
            spaceBetween={30}
            centeredSlides={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              bulletClass: "swiper-pagination-bullet bg-red-600 opacity-50",
              bulletActiveClass: "opacity-100",
            }}
            navigation={{
              nextEl: ".swiper-button-next-banner",
              prevEl: ".swiper-button-prev-banner",
            }}
            modules={[Autoplay, Pagination, Navigation]}
            onAutoplayTimeLeft={onAutoplayTimeLeftBanner}
            className="rounded-lg overflow-hidden h-96"
          >
            {banners?.map((banner) => (
              <SwiperSlide
                key={banner.id}
                className="relative flex items-center justify-center"
              >
                <Image
                  src={banner.img}
                  alt={banner.title_ru || "Banner"}
                  fill
                  className="object-cover"
                  priority={banner === banners[0]}
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
          
              </SwiperSlide>
            ))}
            <div className="absolute bottom-4 right-4 z-10 flex items-center justify-center w-12 h-12">
              <svg
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 48 48"
                ref={progressCircleBanner}
              >
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  className="fill-none stroke-red-600 stroke-4"
                  style={{
                    strokeDasharray: 125.6,
                    strokeDashoffset: `calc(125.6 * var(--progress))`,
                    transition: "stroke-dashoffset 0.1s linear",
                  }}
                />
              </svg>
              <span
                className="absolute text-sm font-bold text-red-600"
                ref={progressContentBanner}
              />
            </div>
            <div className="swiper-button-prev-banner !w-10 !h-10 !bg-white/80 !rounded-full !shadow-md !text-red-600 hover:!bg-white after:!text-lg" />
            <div className="swiper-button-next-banner !w-10 !h-10 !bg-white/80 !rounded-full !shadow-md !text-red-600 hover:!bg-white after:!text-lg" />
          </Swiper>
        </div>

        {/* Day Slider */}
        <div className="w-full lg:w-1/3">
          <Swiper
            spaceBetween={20}
            slidesPerView={1}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              bulletClass: "swiper-pagination-bullet bg-red-600 opacity-50",
              bulletActiveClass: "opacity-100",
            }}
            navigation={{
              nextEl: ".swiper-button-next-day",
              prevEl: ".swiper-button-prev-day",
            }}
            modules={[Autoplay, Pagination, Navigation]}
            onAutoplayTimeLeft={onAutoplayTimeLeftDay}
            className="rounded-lg overflow-hidden h-96" 
            breakpoints={{
              640: { slidesPerView: 1 },
              1024: { slidesPerView: 1 }, 
            }}
          >
            {dayProductItems.map((product) => (
              <SwiperSlide
                key={product.id}
                className="relative flex items-center justify-center bg-gray-100"
              >
                <Image
                  src={product.mainimg}
                  alt={product.title || "Day Product"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
                <div className="absolute inset-0 flex items-center justify-start text-white bg-black/50 p-4 pl-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-1">
                      {product.title}
                    </h3>
                    <p className="text-lg text-red-600">
                      {product.discounted_price
                        ? `${product.discounted_price.toLocaleString()} сум`
                        : `${product.price.toLocaleString()} сум`}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
           
            <div className="swiper-button-prev-day !w-10 !h-10 !bg-white/80 !rounded-full !shadow-md !text-red-600 hover:!bg-white after:!text-lg" />
            <div className="swiper-button-next-day !w-10 !h-10 !bg-white/80 !rounded-full !shadow-md !text-red-600 hover:!bg-white after:!text-lg" />
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default HeaderSlider;
