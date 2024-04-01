import fs from "fs";
import { join } from "pathe";

const dir = process.cwd();

export default defineEventHandler(async (event) => {
  let { path } = getQuery(event);
  const downloads: any = {};
  path = String(path).replace(/\./g, "");
  if (!path) {
    // add status code 404
    return {};
  }

  const filePath = join(dir, "public", "downloads", path as string);

  if (!fs.existsSync(filePath)) {
    // add status code 404
    return {};
  }

  const getDownloads = (url: string, obj: any) => {
    fs.readdirSync(url).forEach((file) => {
      const stat = fs.statSync(join(url, file));
      if (stat.isDirectory()) {
        getDownloads(join(url, file), (obj[file] = []));
      } else {
        obj.push(file);
      }
    });
  };

  getDownloads(filePath, downloads);

  return downloads;
});
