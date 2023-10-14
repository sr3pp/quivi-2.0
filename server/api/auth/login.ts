import jwt from "jsonwebtoken";
import { User } from "~/types/index";
import { User as UserModel } from "~/server/Models";

const { public: config } = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  const { email, password }: User = await readBody(event);

  if (!email || !password) {
    event.node.res.statusCode = 400;
    return "error";
  }

  try {
    const user: User | null = await UserModel.findOne({ email: email });
    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: "User with given email does not exists",
      });
    }
    const validate_pass = await user.verifyPasswordSync(password as string);

    if (validate_pass) {
      const { secret } = config.jwt as { secret: string };
      const token = jwt.sign({ user_id: user._id }, secret, {
        expiresIn: "2h",
      });

      user.token = token;
      return user;
    }

    throw createError({
      statusCode: 404,
      statusMessage: "User with given email or password doesn't exists.",
    });
  } catch (err: any) {
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || err.message,
    });
  }
});
