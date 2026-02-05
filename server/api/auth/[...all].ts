import { toNodeHandler } from "better-auth/node";
import { getAuth } from "~~/server/utils/betterAuth";

const handlerPromise = (async () => {
  const auth = await getAuth();
  return toNodeHandler(auth);
})();

export default defineEventHandler(async (event) => {
  const handler = await handlerPromise;
  await handler(event.node.req, event.node.res);
});
