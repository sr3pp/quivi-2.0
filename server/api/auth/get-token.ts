import jwt from "jsonwebtoken";
import { User } from "~/types/index";

const { public: config } = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  const { _id: id }: User = await readBody(event);
  const { secret } = config.jwt as { secret: string };
  const token = jwt.sign({ user: id }, secret);

  return token;
});
