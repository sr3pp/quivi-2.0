const { public: config } = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  //if is post request
  if (event.method === "POST") {
    const data = await readBody(event);
    console.log("the webhook index: -------------", data);
    return {
      message: "webhook received as post",
    };
  }
  console.log("the webhook index: -------------");
  return {
    message: "webhook received as get",
  };
});
