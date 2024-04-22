import { saeHelper } from "~/server/utilities";

export default defineEventHandler(async (event) => {
  const { orderId } = getQuery(event);
  const { public: config } = useRuntimeConfig();

  const SAE = new saeHelper();
  await SAE.init(config.sae.url);

  try {
    const shipping = await SAE.getShipping(orderId as string);

    if (shipping.error) throw new Error(shipping.error);

    if (!shipping.guia) throw new Error("No se encontro informacion del envio");

    return {
      store: shipping.empresa,
      number: shipping.guia,
      url: shipping.link,
    };
  } catch (error) {
    setResponseStatus(event, 500);
    return error;
  }
});
