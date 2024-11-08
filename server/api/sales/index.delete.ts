import { Sale } from "~/server/Models";

export default defineEventHandler(async (event) => {
  const { id } = await readBody(event);
  await Sale.findOneAndDelete({ _id: id });
  return true;
});
