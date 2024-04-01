import { Sale } from "~/server/Models";

export default defineEventHandler(async (event) => {
  const { order_no } = getRouterParams(event);
  const sale: any = await Sale.findOne({ order_no }).populate([
    {
      path: "products",
      populate: {
        path: "product",
        populate: "brand",
      },
    },
    "user",
    "shipment",
    "bill",
  ]);

  return sale;
});
