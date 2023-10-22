import { Sale } from "~/server/Models";

export default defineEventHandler(async (event) => {
  const data = await readBody(event);
  const sale = await Sale.findByIdAndUpdate(data._id, data)
    .populate("products")
    .populate("user");
  return sale;
});
