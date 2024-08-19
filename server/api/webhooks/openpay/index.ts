const { public: config } = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  //list all webhooks
  return {
    message:
      "webhook received as get, this should list all webhooks in openpay",
  };
});
