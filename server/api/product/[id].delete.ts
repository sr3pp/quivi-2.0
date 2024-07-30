import fs from "fs";
import { join } from "pathe";

import { Product as ProductModel } from "~/server/Models";

const baseDir = process.cwd();
const productsDir = join(baseDir, "public", "products");

export default defineEventHandler(async (event) => {
  const params = getRouterParams(event);
  const { id } = params;
  const product = await ProductModel.findById(id);
  if (!product) {
    throw createError({
      status: 404,
      message: "Producto no encontrado",
    });
  }
  const productDir = join(productsDir, product.web);
  if (fs.existsSync(productDir)) {
    fs.rmdirSync(productDir, { recursive: true });
  }
  await ProductModel.findByIdAndDelete(id);

  return {
    message: "Producto eliminado",
  };
});
