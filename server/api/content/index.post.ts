import fs from "fs";
import { join } from "pathe";

const dir = process.cwd();
export default defineEventHandler(async (e) => {
  const { page } = getQuery(e);
  const data = await readBody(e);

  if (!page) return [];

  const url = join(dir, `content/${String(page).replace(/\./g, "")}.json`);

  try {
    const stream = fs.createWriteStream(url, { flags: "a" });
    stream.write(JSON.stringify(data, null, 2));
    stream.end();
  } catch (error) {
    console.log(error);
    throw error;
  }
  return data;
});
