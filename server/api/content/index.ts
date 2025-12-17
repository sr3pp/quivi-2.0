import fs from "fs";
import { join } from "pathe";

const dir = process.cwd();

export default defineEventHandler(async (event) => {
  const { page, section } = getQuery(event);

  if (!page) return [];

  const normalizedPage = String(page).replace(/^\//, "").replace(/\./g, "");
  const contentPath = `/${normalizedPage}`;
  const url = join(dir, `content/${normalizedPage}.json`);
  const contentSource = JSON.parse(fs.readFileSync(url, "utf-8"));

  const payload = (contentSource as any).body ?? contentSource;
  const content = (payload as any).content ?? payload;

  if (!section) {
    return content;
  }

  const json: Record<string, any> = {};
  String(section)
    .split(",")
    .forEach((element: string) => {
      json[element] = (payload as any)?.[element] ?? content?.[element];
    });
  return json;
});
