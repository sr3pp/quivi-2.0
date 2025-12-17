import jwt from "jsonwebtoken";

const { public: config } = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  const { _id: id } = await readBody(event);
  const { secret } = config.jwt as { secret: string };
  const token = jwt.sign({ user: id }, secret);

  return token;
});
