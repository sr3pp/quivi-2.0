import { User } from "~/types";
import { User as UserModel } from "~/server/Models";

export default defineEventHandler(async (event) => {
  const data = await readBody(event);
  const user = (await UserModel.findById(data._id)) as User;

  user.password = data.password;
  const updatedUser = await user.save();
  return updatedUser;
});
