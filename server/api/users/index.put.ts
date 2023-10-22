import { User as UserModel } from "~/server/Models";

export default defineEventHandler(async (event) => {
  const data = await readBody(event);
  await UserModel.findOneAndUpdate({ _id: data._id }, data);
  const user = await UserModel.findOne({ _id: data._id });
  return user;
});
