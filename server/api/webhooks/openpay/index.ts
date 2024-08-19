const { public: config } = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  const webhooks = await $fetch(
    `${config.openpay.url}/${config.openpay.merchantId}/webhooks`,
  );
  return webhooks;
});
