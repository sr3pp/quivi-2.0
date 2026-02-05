import { Paypal } from "~~/server/utils/paypal";

export default defineEventHandler(async (event) => {
  const { public: config } = useRuntimeConfig();
  const { id } = await readBody(event);
  const { url: baseUrl, client, secret } = config.paypal;
  const paypal = new Paypal(baseUrl, client, secret);
  await paypal.getToken();
  const confirm: any = await paypal.confirmOrder(id);

  return confirm.status;
});
