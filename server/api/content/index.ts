import { join } from "pathe";
import { getContent } from "~/server/utilities";
const dir = process.cwd();
export default defineEventHandler((e) => {
  const { page } = getQuery(e);

  if (!page) return [];

  const url = join(dir, `content/${String(page).replace(/\./g, "")}.json`);
  const content = getContent(url);
  return content;
});
