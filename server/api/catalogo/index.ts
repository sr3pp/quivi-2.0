import fs from "fs";
import { join } from "pathe";
const dir = process.cwd();

export default defineEventHandler(() => {
  const catalogo = fs
    .readdirSync(join(dir, "content", "catalogo"))
    .map((file) => {
      if (!file.includes("index")) {
        const read = fs.readFileSync(
          join(dir, "content", "catalogo", file),
          "utf-8",
        );
        const { card } = JSON.parse(read);
        return card;
      }
    })
    .filter((file) => file)
    .sort((a, b) => a.order - b.order);

  return catalogo;
});
