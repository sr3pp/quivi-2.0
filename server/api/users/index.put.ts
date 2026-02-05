import { getAuth } from "~~/server/utils/betterAuth";

export default defineEventHandler(async (event) => {
  const data = await readBody(event);
  const userId = (data as any).id || (data as any)._id;
  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: "User id is required",
    });
  }

  const { id, _id, ...rest } = data as any;
  const auth = await getAuth();
  const ctx = await auth.$context;
  const updatedUser = await ctx.internalAdapter.updateUser(userId, {
    ...rest,
    admin_level:
      rest.admin_level !== undefined ? Number(rest.admin_level) : undefined,
    updatedAt: new Date(),
  });
  return updatedUser;
});
