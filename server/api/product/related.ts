import { Product } from "~/types";
import { Product as ProductModel, ProductBrand } from "~/server/Models";

export default defineEventHandler(async (event) => {
  const { productId } = getQuery(event);

  // First, get the current product to find its car_brands
  const currentProduct = await ProductModel.findById(productId);

  if (!currentProduct || !currentProduct.car_brands?.length) {
    return [];
  }

  // Find products that share any of the same car_brands, excluding the current product
  const products: Product[] = await ProductModel.find({
    car_brands: { $in: currentProduct.car_brands },
    _id: { $ne: productId },
  }).limit(6);

  return products;
});
