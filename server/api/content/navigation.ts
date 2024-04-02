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

const getData = (file: any, url: string) => {
  const stats = fs.statSync(url);
  if (!stats.isDirectory() && file !== "index.json") {
    const read = fs.readFileSync(url, "utf-8");
    const data = JSON.parse(read);
    return {
      label: data.card?.label || data.navigation?.label || data.label,
      url: url.replace(dir, "").replace("/content", "").replace(".json", ""),
      order: data.card?.order || data.order,
    };
  }

  return {
    label: "",
    url: "",
    order: 0,
  };
};

export default defineEventHandler((e: any) => {
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
            .map((f: string) => getData(f, join(newUrl, f)))
            .filter(
              (el: any) => el.label !== file && el.label && el.label[0] !== "_",
            )
            .sort((a: any, b: any) => a.order - b.order),
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
