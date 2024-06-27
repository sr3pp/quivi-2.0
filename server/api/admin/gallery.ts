import fs from "fs";
import { join } from "pathe";

const dir = join(process.cwd(), "public", "img");

export default defineEventHandler(async (event) => {
  const { folder }: any = getQuery(event);
  const gallery = fs
    .readdirSync(join(dir, folder ? folder : ""))
    .filter((file: string) => file[0] !== ".");
  return gallery;
});
