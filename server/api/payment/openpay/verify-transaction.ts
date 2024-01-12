import { Openpay } from "~/server/utilities";

export default defineEventHandler(async (event) => {
  const { public: config } = useRuntimeConfig();
  const data = await readBody(event);
  const openpay = new Openpay(
    config.openpay.merchantId,
    config.openpay.key,
    config.openpay.url,
  );

  const response = await openpay.verifyCharge(data.transactionId);

  return response;
});
