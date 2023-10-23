import fs from "fs";
import { join } from "pathe";

const dir = process.cwd();

const getContent = (url: string) => {
  const read = fs.readFileSync(url, "utf-8");
  const json = JSON.parse(read);
  const { content } = json;
  return content;
};

export default defineEventHandler((e) => {
  const { page } = getQuery(e);

  if (!page) return [];

  const url = join(dir, `content/${String(page).replace(/\./g, "")}.json`);
  const content = getContent(url);
  return content;
});
