import fs from "fs";
import { join } from "pathe";
import { Product } from "~/server/Models";

const baseUrl = join(process.cwd(), "public", "img", "products");

export default defineEventHandler(async (event) => {
  await Product.deleteMany({});

  if (fs.existsSync(baseUrl)) {
    fs.readdirSync(baseUrl).forEach((file) => {
      const filePath = join(baseUrl, file);
      if (fs.lstatSync(filePath).isDirectory()) {
        fs.rmdirSync(filePath, { recursive: true });
      } else {
        fs.unlinkSync(filePath);
      }
    });
  }

  return {
    message: "All products deleted",
  };
});
