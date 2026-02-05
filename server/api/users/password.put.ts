import { getAuth } from "~~/server/utils/betterAuth";

export default defineEventHandler(async (event) => {
  const data = await readBody<{ id?: string; _id?: string; password: string }>(
    event,
  );
  const userId = data.id || data._id;
  if (!userId || !data.password) {
    throw createError({ statusCode: 400, statusMessage: "Invalid payload" });
  }
  const auth = await getAuth();
  const ctx = await auth.$context;
  await ctx.internalAdapter.updatePassword(userId, data.password);
  return { status: true };
});
