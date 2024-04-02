import { saeHelper } from "~/server/utilities";

export default defineEventHandler(async (event) => {
  const { sae, type }: { sae: string; type: string } = getQuery(event);
  const { public: config } = useRuntimeConfig();
  const SAE = new saeHelper();
  await SAE.init(config.sae.url);
  const existences = await SAE.getExistances(sae, type);
  console.log("existences", SAE.qty);
  return { data: existences };
});
