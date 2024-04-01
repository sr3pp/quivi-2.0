import fs from "fs";

export const getContent = (url: string, isJson: boolean = true) => {
  const read = fs.readFileSync(url, "utf-8");

  if (!isJson) return read;

  const json = JSON.parse(read);
  const { content } = json;
  return content;
};
