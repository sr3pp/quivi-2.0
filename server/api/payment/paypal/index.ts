import { Paypal } from "../../../utilities";

export default defineEventHandler(async (event) => {
  const { public: config } = useRuntimeConfig();
  const { products, order_id: orderId, total } = await readBody(event);
  const { url: baseUrl, client, secret } = config.paypal;

  const paypal = new Paypal(baseUrl, client, secret);
  await paypal.getToken();
  const order: any = await paypal.createOrder(products, orderId, total);
  return order;
});
