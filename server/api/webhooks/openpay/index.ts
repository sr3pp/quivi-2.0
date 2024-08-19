const { public: config } = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  //if is post request
  if (event.method === "POST") {
    console.log("start post: -------------");
    const data = await readBody(event);
    console.log("the webhook post: -------------", data);
    return {
      message: "webhook received as post",
    };
  }
  console.log("the webhook get: -------------");
  return {
    message: "webhook received as get",
  };
});
