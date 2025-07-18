import { User } from "~/server/Models";

export default defineEventHandler(async (event) => {
  const data = await readBody(event);
  try {
    const user = await User.create(data);
    return user;
  } catch (err: any) {
    if (err.code === 11000) {
      // Duplicate key error
      return {
        statusCode: 400,
        message: "Email or RFC already exists.",
        keyValue: err.keyValue,
      };
    }
    // Other errors
    return {
      statusCode: 500,
      message: "Registration failed.",
      error: err.message,
    };
  }
});
