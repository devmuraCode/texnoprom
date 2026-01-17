"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";

import "swiper/css";
import "swiper/css/navigation";

interface SliderItem {
  id: string;
  title: string;
  slug: string;
  img: string;
  link: string;
}

interface ClientSliderProps {
  items: SliderItem[];
  slidesPerView: number;
}

const Slider: React.FC<ClientSliderProps> = ({ items, slidesPerView }) => {
  return (
    <Swiper
      modules={[Autoplay, Navigation]}
      spaceBetween={20}
      slidesPerView={slidesPerView}
      className="w-full max-w-7xl m-0"
      autoplay={{
        delay: 1500,
        disableOnInteraction: false,
      }}
      navigation
    >
      {items.map((item) => (
        <SwiperSlide key={item.id} className="flex justify-center items-center">
          <Link href={item.link} className="block">
            <Image
              src={item.img}
              alt={item.title}
              width={60}
              height={60}
              className="w-12 h-12 object-contain"
            />
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Slider;
