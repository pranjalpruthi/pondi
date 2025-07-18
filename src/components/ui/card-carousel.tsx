import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { SparklesIcon } from "lucide-react";
import {
  Autoplay,
  EffectCoverflow,
  Navigation,
  Pagination,
} from "swiper/modules";
import { Badge } from "@/components/ui/badge";

interface CarouselProps {
  images: { src: string; alt: string }[];
  autoplayDelay?: number;
  showPagination?: boolean;
  showNavigation?: boolean;
}

export const CardCarousel: React.FC<CarouselProps> = ({
  images,
  autoplayDelay = 1500,
  showPagination = true,
  showNavigation = true,
}) => {
  return (
    <>
      <style>
        {`
          .swiper-3d .swiper-slide-shadow-left,
          .swiper-3d .swiper-slide-shadow-right {
            background-image: none;
          }
        `}
      </style>
      <section className="w-full py-4">
        <div className="mx-auto w-full max-w-4xl rounded-3xl border border-black/5 p-2 shadow-sm md:rounded-t-[44px]">
          <div className="relative mx-auto flex w-full flex-col rounded-3xl border border-black/5 bg-neutral-100/80 p-2 shadow-sm md:items-start md:gap-8 md:rounded-b-[20px] md:rounded-t-[40px] md:p-2 dark:bg-neutral-800/5">
            <Badge
              variant="outline"
              className="absolute left-4 top-6 rounded-2xl border-black/10 bg-white/80 px-3 py-1 text-base backdrop-blur-sm md:left-6 dark:border-white/10 dark:bg-black/80"
            >
              <SparklesIcon className="mr-2 h-5 w-5 fill-[#EEBDE0] stroke-1 text-neutral-800 dark:text-neutral-200" />
              Latest component
            </Badge>
            <div className="flex w-full flex-col justify-center pb-2 pl-4 pt-14 md:items-center">
              <div className="flex gap-2">
                <div>
                  <h3 className="text-4xl font-bold tracking-tight text-neutral-800 dark:text-neutral-200">
                    Card Carousel
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Seamless Images carousel animation.
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full px-4">
              <Swiper
                className="!pb-[50px]"
                spaceBetween={50}
                autoplay={{
                  delay: autoplayDelay,
                  disableOnInteraction: false,
                }}
                effect={"coverflow"}
                grabCursor={true}
                centeredSlides={true}
                loop={true}
                slidesPerView={"auto"}
                coverflowEffect={{
                  rotate: 0,
                  stretch: 0,
                  depth: 100,
                  modifier: 2.5,
                }}
                pagination={
                  showPagination ? { clickable: true, dynamicBullets: true } : false
                }
                navigation={showNavigation}
                modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
              >
                {images.map((image, index) => (
                  <SwiperSlide key={index} className="!w-[300px] bg-cover bg-center">
                    <div className="h-full w-full rounded-3xl">
                      <img
                        src={image.src}
                        className="h-full w-full rounded-xl object-cover"
                        alt={image.alt}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
