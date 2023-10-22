import { Sale } from "~/server/Models";

export default defineEventHandler(async () => {
  const sales = await Sale.find().populate("products").populate("user");
  return sales;
});
