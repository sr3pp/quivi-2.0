const { public: config } = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  console.log("event", event);
  return true;
});
