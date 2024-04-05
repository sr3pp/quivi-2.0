import { Category } from "~/server/Models";

export default defineEventHandler(async (event) => {
  const categories = await Category.find();
  return categories;
});
