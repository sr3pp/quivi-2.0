const { public: config } = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  const { webhookId } = getRouterParams(event);
  const webhook = await $fetch(
    `${config.openpay.url}/${config.openpay.merchantId}/webhooks/${webhookId}`,
  );

  return webhook;
});
