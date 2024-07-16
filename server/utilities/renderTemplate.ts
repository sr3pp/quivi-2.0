import { join } from "pathe";
import { getContent } from "./getContent";
import Handlebars from "handlebars";

const dir = process.cwd();

export const renderTemplate = (url: string, context: any) => {
  const stringTemplate = getContent(join(dir, url), "", false);
  const template = Handlebars.compile(stringTemplate);
  return template(context);
};
