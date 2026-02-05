import { getAuth } from "~~/server/utils/betterAuth";

export default defineEventHandler(async () => {
  const auth = await getAuth();
  const ctx = await auth.$context;
  const users = await ctx.internalAdapter.listUsers();
  return users.map((user: any) => {
    // Strip sensitive fields if they ever exist
    const { password, ...safeUser } = user;
    return safeUser;
  });
});
