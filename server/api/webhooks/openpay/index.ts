const { public: config } = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  const data = await readBody(event);
  console.log("the webhook index: -------------", data);
  return true;
});
