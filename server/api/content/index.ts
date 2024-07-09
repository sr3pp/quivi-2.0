import { join } from "pathe";
import { getContent } from "~/server/utilities";
const dir = process.cwd();
export default defineEventHandler((e) => {
  const { page, section } = getQuery(e);

  if (!page) return [];

  const url = join(dir, `content/${String(page).replace(/\./g, "")}.json`);
  if (!section) {
    const content = getContent(url);
    return content;
  } else {
    const elements = section.split(",");
    const json: any = {};
    elements.forEach((element: string) => {
      json[element] = getContent(url, element);
    });
    return json;
  }
});
