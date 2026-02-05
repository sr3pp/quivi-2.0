import { Openpay } from "~~/server/utils/openpay";

export default defineEventHandler(async (event) => {
  const { public: config } = useRuntimeConfig();
  const data = await readBody(event);

  try {
    const openpay = new Openpay(
      config.openpay.merchantId,
      config.openpay.key,
      config.openpay.url,
    );
    const response = await openpay.charge(data);
    return response;
  } catch (error) {
    return error;
  }
});
