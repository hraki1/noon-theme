import React, { useRef, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getBrands } from "@/lib/axios/brandsAxios";
import Spinner from "@/components/UI/SpinnerLoading";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const SCROLL_AMOUNT = 300;

const BrandsSection: React.FC = () => {
  const t = useTranslations("brandsSection");
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["brands"],
    queryFn: getBrands,
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check scroll position to show/hide buttons
  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [data]);

  const scrollBy = (amount: number) => {
    scrollRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <h3 className="text-red-500">{error.name}</h3>
        <p className="py-2">{error.message}</p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          {t("retry")}
        </button>
      </div>
    );
  }

  if (!data || !data.data || data.data.length === 0) {
    return null;
  }

  return (
    <section className="lg:mx-10 mx-5 relative py-5 ">
      <h2 className="text-2xl font-bold mb-8 text-center tracking-tight">{t("brands")}</h2>
      {/* Gradient overlays for scroll hint */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-12 z-10 bg-gradient-to-r from-[#f7f7fa] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-12 z-10 bg-gradient-to-l from-[#f7f7fa] to-transparent" />
      {/* Scroll Buttons */}
      {canScrollLeft && (
        <button
          aria-label="Scroll left"
          className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white shadow-lg rounded-full p-2 border border-gray-200 transition"
          onClick={() => scrollBy(-SCROLL_AMOUNT)}
        >
          <FiChevronLeft className="h-5 w-5 text-gray-800" />
        </button>
      )}
      {canScrollRight && (
        <button
          aria-label="Scroll right"
          className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white shadow-lg rounded-full p-2 border border-gray-200 transition"
          onClick={() => scrollBy(SCROLL_AMOUNT)}
        >
          <FiChevronRight className="h-5 w-5 text-gray-800" />
        </button>
      )}
      <div ref={scrollRef} className="overflow-x-auto scrollbar-hide px-2 md:px-8 relative">
        <div className="flex gap-6 mb-5 snap-x snap-mandatory">
          {data.data.map((brand, idx) => (
            <div
              key={brand.id}
              className="flex flex-col items-center min-w-[120px] bg-white rounded-xl shadow-lg border border-gray-100 p-4 snap-start cursor-pointer group transition-transform duration-300 opacity-0 animate-fadeIn"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <Image
                src={brand.image}
                alt={brand.name}
                width={80}
                height={80}
                className="w-20 h-20 object-contain mb-2 rounded-full border-2 border-gray-200 group-hover:border-blue-400 group-hover:scale-110 transition-all duration-300 shadow-sm"
              />
              <span className="text-base font-semibold text-gray-700 group-hover:text-blue-600 transition-colors text-center mt-1">
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandsSection;

// Add this animation to your global CSS if not present:
// @keyframes fadeIn { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: none; } }
// .animate-fadeIn { animation: fadeIn 0.7s cubic-bezier(0.4,0,0.2,1) forwards; }

// Hide scrollbar utility (TailwindCSS):
// Add to your global CSS if not present:
// .scrollbar-hide::-webkit-scrollbar { display: none; }
// .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; } 