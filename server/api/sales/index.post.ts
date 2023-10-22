import { Sale } from "~/server/Models";

export default defineEventHandler(async (event) => {
  const data = await readBody(event);
  const sale = await Sale.create(data);
  return sale;
});
