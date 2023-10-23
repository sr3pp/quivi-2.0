import fs from "fs";
import { join } from "pathe";
const dir = process.cwd();
const getSlides = () => {
  const url = join(dir, "content/_slides");
  const slideFiles = fs.readdirSync(url);
  const slides = slideFiles.map((file) => {
    const read = fs.readFileSync(join(url, file), "utf-8");
    const json = JSON.parse(read);
    return json;
  });
  return slides;
};

export default defineEventHandler(() => {
  return getSlides();
});
