import { Product } from "~~/server/Models";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  try {
    const product = await Product.create(body);
    return product;
  } catch (error) {
    setResponseStatus(event, 500);
    return error;
  }
});
