export default defineEventHandler(async (event) => {
  console.log("start post: -------------");
  const data = await readBody(event);
  console.log("the webhook post: -------------", data);
  return {
    message: "webhook received as post",
  };
});
