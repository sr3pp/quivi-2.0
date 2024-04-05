import jwt from "jsonwebtoken";
import { User as UserModel } from "~/server/Models";

const { public: config } = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event);

  if (!email || !password) {
    setResponseStatus(event, 400);
    return "error";
  }

  try {
    const user: any = await UserModel.findOne({ email: email }).select(
      "+password",
    );
    if (!user) {
      setResponseStatus(event, 404);
      return {
        error: "User does not exists",
      };
    }

    const validate_pass = await user.verifyPasswordSync(password);

    if (!validate_pass) {
      setResponseStatus(event, 404);
    }

    const { secret } = config.jwt as { secret: string };
    const token = jwt.sign({ user_id: user._id }, secret, {
      expiresIn: "2h",
    });

    return {
      token,
      user: {
        id: user._id,
        name: user.profile.name,
        email: user.email,
      },
    };
  } catch (err: any) {
    console.error(err);
    setResponseStatus(event, 500);
    return {
      error: err,
    };
  }
});
