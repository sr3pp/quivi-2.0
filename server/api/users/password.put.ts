import { User as UserModel } from "../../Models";

export default defineEventHandler(async (event) => {
  const data = await readBody(event);
  const user: any = await UserModel.findById(data._id);

  user.password = data.password;
  const updatedUser = await user.save();
  return updatedUser;
});
