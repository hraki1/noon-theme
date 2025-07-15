"use client";

import StarRating from "@/components/shared/StarRating";
import Modal from "@/components/UI/Modal";
import Spinner from "@/components/UI/SpinnerLoading";
import {
  addReview,
  AddReviweRequest,
  getReviewsForProduct,
} from "@/lib/axios/reviewAxiox";
import { OrderItem } from "@/lib/models/orderModal";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaExclamationTriangle, FaRegStar } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { useCurrency } from "@/store/CurrencyContext";

interface productItemProps {
  item: OrderItem;
  orderStatus: boolean;
}

const ProductItem: React.FC<productItemProps> = ({ item, orderStatus }) => {
  const router = useRouter();
  const t = useTranslations("account.myProducts.myProduct.myProducts");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [errorReview, setErrorsReview] = useState<string[] | null>(null);
  console.log(hoveredStar);
  const {
    data: review,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["reviews", item.product.product_id],
    queryFn: ({ signal }) =>
      getReviewsForProduct(item.product.product_id as number, signal),
    enabled: !!item.product.product_id,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: addReview,
    mutationKey: ["reviews", item.product.product_id],
    onSuccess: () => {
      setComment("");
      setRating(0);
      toggleDetails();
      toast.success(t("toast.addSuccess"));
      refetch();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const { rate, userCurrency } = useCurrency();

  function viewPriceCurencyHandler(priceNumber: number) {
    const price = (Number(priceNumber) * rate).toFixed(2);
    return price ? price : 0;
  }

  const toggleDetails = () => setIsModalOpen(!isModalOpen);
  const handleStarClick = (index: number) => setRating(index);

  function handleViewProduct() {
    router.push(`/product/${item.product.product_id}`);
  }

  function handleSubmitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const reviewData: AddReviweRequest = {
      product_id: item.product.product_id,
      rating: rating,
      review_text: comment,
    };
    const errors: string[] = [];
    if (reviewData.review_text.length === 0) {
      errors.push(t("form.errors.emptyReview"));
    }

    if (errors.length > 0) {
      setErrorsReview(errors);
      return;
    }

    mutate(reviewData);
  }

  if (isLoading) {
    return (
      <div className="my-40 mt-56">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <h3 className="text-red-500">{error.name}</h3>
        <p className="py-10">{error.message}</p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          {t("retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 border border-gray-200 rounded-lg flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
        <div className="bg-gray-100 rounded flex items-center justify-center">
          <Image
            src={item.product.images[0].origin_image}
            alt={item.product_name || "Product image"}
            width={70}
            height={50}
            priority
            className="cursor-pointer"
            onClick={handleViewProduct}
          />
        </div>
        <div>
          <p className="font-medium">{item.product_name}</p>
          <p className="text-sm text-gray-500">
            {userCurrency} {viewPriceCurencyHandler(item.product_price ?? 0)} *{" "}
            {item.qty} ={userCurrency}{" "}
            {item.qty * Number(viewPriceCurencyHandler(item.product_price ?? 0))}
          </p>
        </div>
      </div>

      <div className="w-full md:w-auto text-end">
        {review && review[0] ? (
          <StarRating rating={review[0]?.rating ?? 0} interactive={false} />
        ) : (
          orderStatus && (
            <button
              onClick={toggleDetails}
              disabled={isLoading}
              className="flex flex-wrap items-center gap-1 border border-blue-700 pr-text hover:bg-blue-50 transition rounded-full px-4 py-1.5 font-medium disabled:opacity-50"
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <FaRegStar key={star} size={16} className="pr-text" />
              ))}
              <span className="ml-1 pr-text font-bold">{t("reviewBtn")}</span>
            </button>
          )
        )}
      </div>

      <Modal open={isModalOpen} classesName="pr-bg">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4 text-white">
            {t("modal.title", { name: item.product_name })}
          </h2>

          {errorReview && (
            <div className="mb-4 flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded">
              <FaExclamationTriangle />
              {errorReview.map((errText, index) => (
                <span key={index}>{errText}</span>
              ))}
            </div>
          )}

          <div className="mb-4">
            <label className="block mb-2 font-medium text-gray-400">
              {t("form.ratingLabel")}
            </label>
            <StarRating
              rating={rating}
              onRatingChange={{ setHoveredStar, handleStarClick }}
              size={24}
            />
          </div>

          <form onSubmit={handleSubmitForm}>
            <div className="mb-4">
              <label className="block mb-2 font-medium text-gray-400">
                {t("form.reviewLabel")}
              </label>
              <textarea
                rows={3}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
                placeholder={t("form.placeholder")}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={500}
              />
              <div className="text-end text-sm text-gray-500 mt-1">
                {comment.length}/500 {t("form.characters")}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <button
                type="submit"
                disabled={isPending}
                className={`px-4 py-2 rounded font-medium text-white ${
                  isPending
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isPending ? t("form.submitting") : t("form.submit")}
              </button>
              <button
                type="button"
                onClick={toggleDetails}
                disabled={isPending}
                className="px-4 py-2 rounded border border-gray-300 text-gray-400 hover:bg-gray-100 disabled:opacity-50"
              >
                {t("form.cancel")}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default ProductItem;
