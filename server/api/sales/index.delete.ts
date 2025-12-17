import { Sale } from "../../Models";

export default defineEventHandler(async (event) => {
  const { id } = await readBody(event);
  console.log(id);
  await Sale.findOneAndDelete({ _id: id });
  return true;
});
