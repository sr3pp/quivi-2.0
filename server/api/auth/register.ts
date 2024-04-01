import { User } from "~/server/Models";

export default defineEventHandler(async (event) => {
  const data = await readBody(event);
  console.log(data);
  const user = await User.create(data);
  return user;
});
