import { saeHelper } from "~/server/utilities";

export default defineEventHandler(async (event) => {
  const { public: config } = useRuntimeConfig();
  const SAE: any = new saeHelper();
  await SAE.init(config.sae.url);

  SAE.getShipping("08980");

  return true;
});
