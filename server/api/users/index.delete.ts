import { getAuth } from "~~/server/utils/betterAuth";

export default defineEventHandler(async (event) => {
  const { id } = await readBody<{ id: string }>(event);
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "User id is required",
    });
  }
  const auth = await getAuth();
  const ctx = await auth.$context;
  await ctx.internalAdapter.deleteUser(id);
  return true;
});
