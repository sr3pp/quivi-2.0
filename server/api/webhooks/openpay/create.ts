import { Openpay } from "~/server/utilities";

const { public: config } = useRuntimeConfig();

export default defineEventHandler(async ($event) => {
  const { user, url, password, event_types } = await readBody($event);
  const openpay = new Openpay(
    config.openpay.merchantId,
    config.openpay.key,
    config.openpay.url,
  );

  const webhook = await openpay.createWebhook({
    user,
    url,
    password,
    event_types,
  });

  console.log("webhook", webhook);

  return webhook;
});
