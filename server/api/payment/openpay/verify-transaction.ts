import { Openpay } from "~~/server/utils/openpay";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const data = await readBody<{ transactionId?: string }>(event);
  const transactionId = String(data?.transactionId || "").trim();

  if (!transactionId) {
    throw createError({
      statusCode: 400,
      statusMessage: "transactionId is required",
    });
  }

  const openpay = new Openpay(
    config.openpay.merchantId,
    config.openpay.key,
    config.openpay.url,
  );

  const response = await openpay.verifyCharge(transactionId);

  return response;
});
