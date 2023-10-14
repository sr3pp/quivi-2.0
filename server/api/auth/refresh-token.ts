import jwt from "jsonwebtoken";

const { public: config } = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  const { token }: any = await readBody(event);
  const { secret } = config.jwt as { secret: string };
  const isValid = jwt.verify(token, secret);

  return isValid;
});
