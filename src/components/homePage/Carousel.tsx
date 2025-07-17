"use client";
import React from "react";
import Image from "next/image";
import { Collection } from "@/lib/models/collectionModal";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Parallax, Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/parallax";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

interface CarouselProps {
  collections: Collection[];
}

const Carousel: React.FC<CarouselProps> = ({ collections }) => {
  const router = useRouter();
  // Fallback images if collections is empty
  const imagesToDisplay =
    collections?.length > 0
      ? collections
      : [
        {
          collection_id: "1",
          image: "/image/carousel/carousel-1.png",
          name: "Default Banner 1",
        },
        {
          collection_id: "2",
          image: "/image/carousel/carousel-2.png",
          name: "Default Banner 2",
        },
      ];

  if (collections.length === 0) {
    return null
  }

  return (
    <div className="lg:mx-10 relative bg-white">
      {/* Swiper navigation arrows outside for correct DOM timing */}
      <button
        className="custom-swiper-prev absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-white hover:bg-gray-100 shadow-md rounded-full w-10 h-10 flex items-center justify-center transition-all duration-200 border border-gray-200"
        aria-label="Previous slide"
        type="button"
      >
        <AiOutlineLeft className="w-6 h-6 text-[#1a7a9a]" />
      </button>
      <button
        className="custom-swiper-next absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-white hover:bg-gray-100 shadow-md rounded-full w-10 h-10 flex items-center justify-center transition-all duration-200 border border-gray-200"
        aria-label="Next slide"
        type="button"
      >
        <AiOutlineRight className="w-6 h-6 text-[#1a7a9a]" />
      </button>
      <div className="rounded relative">
        <Swiper
          modules={[Parallax, Autoplay, Pagination, Navigation]}
          speed={900}
          parallax={true}
          loop={true}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true, dynamicBullets: true }}
          navigation={{
            nextEl: ".custom-swiper-next",
            prevEl: ".custom-swiper-prev",
          }}
          className="rounded shadow-2xl"
          style={{ height: "420px" }}
        >
          {/* Parallax background layer */}
          <div
            slot="container-start"
            className="absolute inset-0 z-0"
            data-swiper-parallax="-30%"
          >
          </div>

          {imagesToDisplay.map((collection, idx) => (
            <SwiperSlide key={collection.collection_id || idx}>
              <div className="relative w-full h-[420px] flex items-center justify-center cursor-pointer select-none" onClick={() => router.push(`/shopGrid?collectionId=${collection.collection_id}`)}>
                {/* Parallax image */}
                <div className="absolute inset-0 z-10" data-swiper-parallax="0">
                  <Image
                    src={collection.image}
                    alt={collection.name || `Banner ${idx + 1}`}
                    fill
                    className="object-cover rounded"
                    priority={idx === 0}
                  />
                  {/* Gradient overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent rounded" />
                </div>
                {/* Text/content overlay */}
                {/* <div
                  className="absolute left-6 bottom-6 z-20 bg-white/90 px-6 py-3 rounded-lg shadow-md flex flex-col items-start gap-2"
                  data-swiper-parallax="-200"
                >
                  <span className="text-xl md:text-2xl font-bold text-gray-900">
                    {collection.name}
                  </span>
                  <button
                    className="mt-2 px-5 py-1.5 rounded bg-[#1a7a9a] text-white font-semibold hover:bg-[#219EBC] transition-all duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/shopGrid?collectionId=${collection.collection_id}`);
                    }}
                  >
                    Shop Now
                  </button>
                </div> */}
              </div>
            </SwiperSlide>
          ))}

        </Swiper>
      </div>
    </div>
  );
};

export default Carousel;
