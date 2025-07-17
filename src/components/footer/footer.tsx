"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiCreditCard,
  FiPhone,
  FiMail,
  FiHelpCircle,
  // FiMail,
  // FiMapPin,
  // FiClock,
  // FiStar,
  // FiZap,
  // FiMessageSquare,
  // FiRefreshCw,
} from "react-icons/fi";
import { useSettings } from "@/store/SettingsContext";
import { useCategories } from "@/store/CategoriesContext";
import Spinner from "../UI/SpinnerLoading";
import { MdLocalShipping } from "react-icons/md";
import { organizeCategories } from "@/utils/organizeCategories";

export default function Footer() {
  const t = useTranslations("footer");
  const settings = useSettings();
  const { categories, isLoading, error } = useCategories();

  if (isLoading) {
    return (
      <div className="my-20">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-20">
        <h1>{error.name}</h1>
        <h3>{error.message}</h3>
      </div>
    );
  }

  const displayCategories = organizeCategories(categories || []);

  return (
    <footer className="bg-white text-black">
      {/* Email & Phone Section */}
      <div className="bg-[#f3f4f8]  md:px-8 lg:px-12 py-12 px-6 border-y border-gray-300">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-bold mb-4">{t("supportTitle")}</h3>
              <p className="max-w-md text-gray-600">{t("supportDesc")}</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8 justify-center items-center w-full lg:w-auto">

              <div className="flex flex-col gap-3">

                <div className="w-full lg:w-auto">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-full flex justify-center items-center shadow-sm">
                      <FiPhone className="text-lg" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm capitalize">{t("supportMobile")}</p>
                      <p className="font-bold text-gray-800 text-nowrap">{settings.contact_phone}</p>
                    </div>
                  </div>
                </div>

                <div className="w-full lg:w-auto">
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-full flex justify-center items-center shadow-sm">
                      <FiMail className="text-lg" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm capitalize">{t("supportEmail")}</p>
                      <p className="font-bold text-gray-800">{settings.contact_email}</p>
                    </div>
                  </div>
                </div>

                <div className="w-full lg:w-auto">
                  <div className="flex items-center gap-4 justify-center">
                    <div className="w-10 h-10 bg-white rounded-full flex justify-center items-center shadow-sm">
                      <FiHelpCircle className="text-lg" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm capitalize">{t("supportCenter")}</p>
                      <p className="font-bold text-gray-800">{settings.contact_email}</p>
                    </div>
                  </div>
                </div>
              </div>




            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-12 px-6 md:px-8 lg:px-12 bg-white">
        <div className="container mx-auto max-w-6xl">


          {/* categories lists */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12 text-center">

            {/* quick links */}
            <div>
              <h3 className="text-lg font-semibold mb-6">{t("links.title")}</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/infoPages/about"
                    className=" text-gray-600 hover:text-primary-500 transition-colors"
                  >
                    {t("links.about")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/infoPages/contact"
                    className="text-gray-600 hover:text-primary-500transition-colors"
                  >
                    {t("links.contact")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/infoPages/faq"
                    className="text-gray-600 hover:text-primary-500  transition-colors"
                  >
                    {t("links.faq")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Categories */}
            {displayCategories.parentsWithChildren?.map((parent) => (
              <div key={parent.id} className="mb-6">
                <h3 className="text-lg font-semibold mb-4">{parent.description.name}</h3>
                <ul className="space-y-3">
                  {parent.children?.map((child) => (
                    <li key={child.id}>
                      <Link
                        href={`/shopGrid?categoryid=${child.id}`}
                        className="text-gray-600 hover:text-primary-500 transition-colors"
                      >
                        {child.description.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {displayCategories.parentsWithoutChildren?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">{t("categories.title")}</h3>
                <ul className="space-y-3">
                  {displayCategories.parentsWithoutChildren.map((parent) => (
                    <li key={parent.id}>
                      <Link
                        href={`/shopGrid?categoryid=${parent.id}`}
                        className="text-gray-600 hover:text-primary-500 transition-colors"
                      >
                        {parent.description.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* social links and store info */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
            <div className="flex flex-col items-center md:items-start">
              <h2 className="text-2xl font-bold mb-4">{settings.store_name}</h2>
              <p className="text-gray-600 mb-6 max-w-md text-center md:text-left">
                {t("about.description")}
              </p>
            </div>

            <div className="flex flex-col items-center">
              <h4 className="text-lg font-medium mb-4">{t("contactUs")}</h4>
              <div className="flex gap-4">
                <Link
                  href={settings.social_media_links.facebook || "#"}
                  className="bg-[#feee00] hover:bg-primary-600 w-12 h-12 rounded-full flex items-center justify-center transition-colors shadow-sm"
                  aria-label="Facebook"
                >
                  <FiFacebook className="text-xl" />
                </Link>
                <Link
                  href={settings.social_media_links.twitter || "#"}
                  className="bg-[#feee00] hover:bg-primary-600 w-12 h-12 rounded-full flex items-center justify-center transition-colors shadow-sm"
                  aria-label="Twitter"
                >
                  <FiTwitter className="text-xl" />
                </Link>
                <Link
                  href={settings.social_media_links.instagram || "#"}
                  className="bg-[#feee00] hover:bg-primary-600 w-12 h-12 rounded-full flex items-center justify-center transition-colors shadow-sm"
                  aria-label="Instagram"
                >
                  <FiInstagram className="text-xl" />
                </Link>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mb-12">
            <h4 className="text-center text-lg font-medium mb-6">
              {t("payment.title")}
            </h4>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-gray-100 px-6 py-3 rounded-md flex items-center gap-2">
                <FiCreditCard className="text-gray-700" />
                <span className="text-sm text-gray-700">{t("payment.methods.visa")}</span>
              </div>
              <div className="bg-gray-100 px-6 py-3 rounded-md flex items-center gap-2">
                <FiCreditCard className="text-gray-700" />
                <span className="text-sm text-gray-700">{t("payment.methods.mastercard")}</span>
              </div>
              <div className="bg-gray-100 px-6 py-3 rounded-md flex items-center gap-2">
                <MdLocalShipping className="text-gray-700" />
                <span className="text-sm text-gray-700">{t("payment.methods.cod")}</span>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-200 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-500 text-sm">
                {t("copyright", {
                  year: new Date().getFullYear(),
                  name: settings.store_name,
                })}
              </p>

              <div className="flex flex-wrap justify-center gap-6">
                <Link href="/infoPages/privacyPolicy">
                  <span className="text-gray-500 hover:text-primary-500 text-sm transition-colors">
                    {t("links.privacy")}
                  </span>
                </Link>
                <Link href="/infoPages/termsOfService">
                  <span className="text-gray-500 hover:text-primary-500 text-sm transition-colors">
                    {t("links.terms")}
                  </span>
                </Link>
                <Link href="/infoPages/shippingPolicy">
                  <span className="text-gray-500 hover:text-primary-500 text-sm transition-colors">
                    {t("links.shipping")}
                  </span>
                </Link>
                <Link href="/infoPages/returnPolicy">
                  <span className="text-gray-500 hover:text-primary-500 text-sm transition-colors">
                    {t("links.refund")}
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
