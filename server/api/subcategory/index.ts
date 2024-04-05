import { Subcategory } from "~/server/Models";

export default defineEventHandler(async (event) => {
  const categories = await Subcategory.find();
  return categories;
});
