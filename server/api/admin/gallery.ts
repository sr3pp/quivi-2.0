import fs from "fs";
import { join } from "pathe";

const dir = join(process.cwd(), "public", "img");

export default defineEventHandler(async (event) => {
  const gallery = fs.readdirSync(dir);
  return gallery;
});
