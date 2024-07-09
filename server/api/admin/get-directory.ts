import fs from "fs";
import { join } from "pathe";
import { Directory } from "sr-content-2/types";

const basePath = process.cwd();

const readAsync = (path: string) => {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, files) => {
      if (err) reject(err);
      resolve(files);
    });
  });
};

const getDirectory = async (directory: Directory, path: string) => {
  const dir = fs.statSync(path);

  if (dir.isDirectory()) {
    const files: any = await readAsync(path);
    for (const file of files) {
      const filePath = join(directory.path, file);
      const fullPath = join(path, file);
      if (file === "." || file === ".." || file[0] === ".") continue;
      if (!directory.children) {
        directory.children = [];
      }
      directory.children.push({
        name: file,
        path: filePath,
        children: await getDirectory(
          {
            name: file,
            path: filePath,
          },
          fullPath,
        ),
      });
    }

    return directory.children;
  }

  return null;
};

export default defineEventHandler(async (event) => {
  const { folder } = await getQuery(event);
  const dirPath = join(
    basePath,
    "public",
    (folder as string).replace(/\//g, "").replace(/\./g, ""),
  );
  const directory: Directory = {
    name: folder as string,
    path: folder as string,
    children: [],
  };
  await getDirectory(directory, dirPath);
  return directory;
});
