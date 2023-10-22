import { User } from "~/types";
import { User as UserModel } from "~/server/Models";

export default defineEventHandler(async () => {
  const users: User[] = await UserModel.find();
  return users;
});
