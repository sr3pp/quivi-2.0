import fs from "fs";
import { join } from "pathe";

const baseDir = join(process.cwd(), "public");

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const file = body.file;
  const filePath = join(baseDir, file);

  try {
    fs.unlinkSync(filePath);
  } catch (error) {
    throw new Error("Error deleting file");
  }

  return {
    message: "File deleted successfully",
  };
});
