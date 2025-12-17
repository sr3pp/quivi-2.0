import { Sale } from "../../Models";

export default defineEventHandler(async (event) => {
  const { order_no, status, payment } = await readBody(event);

  if (!order_no) {
    throw createError({ statusCode: 400, statusMessage: "order_no required" });
  }

  const update: any = {};
  if (typeof status === "boolean") update.status = status;
  if (payment) {
    if (typeof payment.status === "boolean")
      update["payment.status"] = payment.status;
    if (typeof payment.transaction === "string")
      update["payment.transaction"] = payment.transaction;
  }

  if (Object.keys(update).length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "No fields to update",
    });
  }

  const sale = await Sale.findOneAndUpdate({ order_no }, update, { new: true });

  if (!sale) {
    throw createError({ statusCode: 404, statusMessage: "Sale not found" });
  }

  return sale;
});
