import fs from "fs";

export const getContent = (
  url: string,
  section: string = "content",
  isJson: boolean = true,
) => {
  const read = fs.readFileSync(url, "utf-8");

  if (!isJson) return read;

  const json = JSON.parse(read);
  return json[section];
};
