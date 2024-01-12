import { Openpay } from "~/server/utilities";

export default defineEventHandler(async (event) => {
  const { public: config } = useRuntimeConfig();
  const data = await readBody(event);
  try {
    const openpay = new Openpay(
      config.openpay.merchantId,
      config.openpay.key,
      config.openpay.url,
    );
    const response = openpay.charge(data);
    return response;
  } catch (error) {
    return error;
  }
});
