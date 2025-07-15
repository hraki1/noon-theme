import { Product } from "@/lib/models/productsModal";
import { FrontendProduct } from "@/models/forntEndProduct";

export function transformProduct(product: Product): FrontendProduct {
  return {
    id: product.product_id,
    uuid: product.uuid,
    name: product.description?.name || "Unnamed Product",
    price: product.price ?? 0,
    originalPrice: product.old_price ?? undefined,
    image:
      product.images?.find((img) => img.is_main)?.origin_image ||
      product.images?.[0]?.origin_image,
    rating: product.meanRating || 0,
    description: product.description?.description || "",
    short_description: product.description?.short_description || "",
    isNew:
      new Date(product.created_at) >
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),

    tags: [
      !product.inventory?.stock_availability ? "OUT OF STOCK" : undefined,
      product.old_price ? "SALE" : undefined,
      new Date(product.created_at) >
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        ? "NEW"
        : undefined,
    ].filter(Boolean) as string[],
    inventory: {
      stock_availability: product.inventory?.qty === 0 ? false : true,
      qty: product.inventory?.qty || 0,
    },
    images: product.images?.map((img) => ({
      product_image_id: img.product_image_id,
      product_image_product_id: img.product_image_product_id,
      single_image: img.single_image,
      thumb_image: img.thumb_image,
      origin_image: img.origin_image,
      listing_image: img.listing_image,
      is_main: img.is_main,
      created_at: img.created_at,
      updated_at: img.updated_at,
    })),
    attributes: product.attributes?.map((attr) => ({
      attribute_id: attr.attribute_id,
      option_text: attr.option_text,
    })),
    categoryId: product.category_id,
    createdAt: product.created_at,
    url_key: product.description.url_key,
    // reviews: product.reviews
    meanRating: product.meanRating,
    stock_availability: product.inventory.qty === 0 ? false : true, // or set appropriate default/fallback
    group_id: product.group_id,
    variant_group_id: product.variant_group_id,
  };
}
