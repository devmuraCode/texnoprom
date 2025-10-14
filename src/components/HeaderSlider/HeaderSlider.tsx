import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";

export const HeaderSlider = () => {
  return (
    <div>
      <Swiper
        spaceBetween={50}
        slidesPerView={3}
        onSlideChange={() => console.log("slide change")}
        onSwiper={(swiper) => console.log(swiper)}
      >
        <SwiperSlide>
         <Image src={""} alt=""/>
        </SwiperSlide>
        <SwiperSlide>

        </SwiperSlide>
        ...
      </Swiper>
    </div>
  );
};
