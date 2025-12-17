import { User as UserModel } from "../../Models";

export default defineEventHandler(async (event) => {
  const { id } = await readBody(event);
  await UserModel.deleteOne({ _id: id });
  return true;
});
