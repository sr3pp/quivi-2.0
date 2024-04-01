import { Sale } from "~/server/Models";

export default defineEventHandler(async () => {
  const sales: any = await Sale.find()
    .populate({
      path: "products",
      populate: {
        path: "product",
        populate: "brand",
      },
    })
    .populate(["user", "shipment", "bill"]);
  return sales;
});
