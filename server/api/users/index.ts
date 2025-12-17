import { User as UserModel } from "../../Models";

export default defineEventHandler(async () => {
  const users = await UserModel.find();
  return users;
});
