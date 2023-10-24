import fs from "fs";
import { join } from "pathe";
const dir = process.cwd();

const parseJsonName = (name: string) => {
  return name.replace("index", "").replace(".json", "");
};

const buildName = (url: string): string => {
  const arr = url.split("/");
  const last = arr.pop();
  return last?.includes("index") ? "home" : String(last);
};

const getNav = (url: string) => {
  const read = fs.readFileSync(url, "utf-8");
  const { navigation: nav } = JSON.parse(read);
  return nav;
};

export default defineEventHandler((e) => {
  const navigation: any = [];

  const getNames = (url: any, obj: any) => {
    const files = fs.readdirSync(url);
    files.forEach((file) => {
      const newUrl = join(url, file);

      if (fs.statSync(newUrl).isDirectory() && !["_", "."].includes(file[0])) {
        obj.push({
          ...getNav(join(newUrl, "index.json")),
          url: "/" + file,
          items: fs
            .readdirSync(newUrl)
            .map((f: string) => ({
              name: f.includes("index")
                ? buildName(file)
                : f.replace(".json", ""),
              url: "/" + join(file, parseJsonName(f)),
            }))
            .filter((el) => el.name !== file && el.name[0] !== "_"),
        });
        //getNames(newUrl, obj[file]);
      } else if (!["_", "."].includes(file[0])) {
        obj.push({
          ...getNav(newUrl),
          url: "/" + parseJsonName(file),
        });
      }
    });
  };

  getNames(join(dir, "content"), navigation);
  return navigation.sort((a: any, b: any) => a.order - b.order);
});
