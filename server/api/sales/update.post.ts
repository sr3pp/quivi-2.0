import { Sale } from "~~/server/Models";
import { Openpay } from "~~/server/utils/openpay";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const { order_no, status, payment } = await readBody<{
    order_no?: string;
    status?: boolean;
    payment?: { status?: boolean; transaction?: string };
  }>(event);

  if (!order_no) {
    throw createError({ statusCode: 400, statusMessage: "order_no required" });
  }

  const isMarkingPaid = status === true || payment?.status === true;
  const transactionId = String(payment?.transaction || "").trim();

  if (isMarkingPaid) {
    if (!transactionId) {
      throw createError({
        statusCode: 400,
        statusMessage: "payment.transaction required when status=true",
      });
    }

    const sale = await Sale.findOne({ order_no });
    if (!sale) {
      throw createError({ statusCode: 404, statusMessage: "Sale not found" });
    }

    const openpay = new Openpay(
      config.openpay.merchantId,
      config.openpay.key,
      config.openpay.url,
    );

    const charge = (await openpay.verifyCharge(transactionId)) as {
      status?: string;
      order_id?: string;
      amount?: number;
    };

    if (charge.status !== "completed") {
      throw createError({
        statusCode: 400,
        statusMessage: "Openpay charge is not completed",
      });
    }

    if (String(charge.order_id || "") !== String(order_no)) {
      throw createError({
        statusCode: 400,
        statusMessage: "Transaction does not belong to this order",
      });
    }

    if (
      typeof charge.amount === "number" &&
      Math.abs(Number(charge.amount) - Number(sale.total)) > 0.01
    ) {
      throw createError({
        statusCode: 400,
        statusMessage: "Amount mismatch",
      });
    }

    const updated = await Sale.findOneAndUpdate(
      { order_no },
      {
        status: true,
        "payment.status": true,
        "payment.transaction": transactionId,
      },
      { new: true },
    );

    return updated;
  }

  throw createError({
    statusCode: 400,
    statusMessage: "Only paid status updates are allowed",
  });
});
