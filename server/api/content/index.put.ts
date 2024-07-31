import fs from "fs";
import { join } from "pathe";
import { getContent } from "~/server/utilities";
const dir = process.cwd();
export default defineEventHandler(async (e) => {
  const { page, section } = getQuery(e);
  const data = await readBody(e);

  if (!page) return [];

  const url = join(dir, `content/${String(page).replace(/\./g, "")}.json`);

  try {
    let jsonFile = JSON.parse(fs.readFileSync(url, "utf-8"));
    if (section) {
      if (section === "all") {
        jsonFile = data;
      } else {
        jsonFile[section as string] = data;
      }
    } else {
      jsonFile.content = data;
    }
    console.log("the url: ", url);
    fs.writeFileSync(url, JSON.stringify(jsonFile, null, 2));
    return jsonFile;
  } catch (error) {
    console.log(error);
    throw error;
  }
});
