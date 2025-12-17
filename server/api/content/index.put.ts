import fs from "fs";
import { join } from "pathe";
const dir = process.cwd();
export default defineEventHandler(async (e) => {
  const { page, section } = getQuery(e);
  const data = await readBody(e);

  if (!page) return [];

  const contentDir = join(dir, "content");
  if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
  }

  const url = join(contentDir, `${String(page).replace(/\./g, "")}.json`);

  if (!fs.existsSync(url)) {
    fs.writeFileSync(url, JSON.stringify({ content: [] }, null, 2));
  }

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

    fs.writeFileSync(url, JSON.stringify(jsonFile, null, 2));
    return jsonFile;
  } catch (error) {
    console.log(error);
    throw error;
  }
});
