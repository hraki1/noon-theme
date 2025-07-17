"use client";

import { useCategories } from "@/store/CategoriesContext";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function CategoriesList() {
  const t = useTranslations("category");
  const { categories } = useCategories();



  return (
    <section className="py-2 md:py-16 text-center pt-10 mb-4 lg:mx-10 relative bg-white">
      <div className="container mx-auto">
        {!categories && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-5 gap-6">
            <h1> {t("noCategory")}</h1>
          </div>
        )}
        <div className="relative">
          <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 overflow-x-auto gap-10 sm:gap-4 md:gap-5 pb-4 custom-scroll">
            {categories &&
              categories.map((cat, index) => (
                <Link
                  href={`/shopGrid?categoryid=${cat.id}`}
                  key={index}
                  className="flex flex-col items-center text-center group w-24 sm:w-28 md:w-auto"
                >
                  <div className="w-[78px] h-[78px] sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-[#fff] group-hover:scale-105 transition-transform duration-300">
                    <Image
                      src={cat.description.image ?? "/image/products/img.png"}
                      alt={cat.description.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="mt-2 text-sm sm:text-base  mx-2 font-bold  text-black ">
                    {cat.description.name}
                  </span>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
