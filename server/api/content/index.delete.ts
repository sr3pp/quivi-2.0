import fs from "fs";
import { join } from "pathe";

const dir = process.cwd();
export default defineEventHandler(async (e) => {
  const { page } = getQuery(e);

  if (!page) return [];

  const url = join(dir, `content/${String(page).replace(/\./g, "")}.json`);
  try {
    fs.rmSync(url, { recursive: true });
  } catch (error) {
    console.log(error);
    throw new Error(error as string);
  }
  return true;
});
