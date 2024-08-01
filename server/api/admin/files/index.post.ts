import fs from "fs";
import { join } from "pathe";

const baseDir = join(process.cwd(), "public");

export default defineEventHandler(async (event) => {
  const data: any = await readMultipartFormData(event);

  const idx = data.findIndex((item: any) => item.name === "url");
  const [{ data: url }] = data.splice(idx, 1);

  const downloadDir = join(baseDir, url);

  try {
    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir, { recursive: true });
    }

    data?.forEach(async (file: any) => {
      const filePath = join(downloadDir, file.filename);
      fs.writeFileSync(filePath, file.data);
    });
  } catch (error) {
    console.log(error);
    throw new Error("Error uploading files");
  }

  return {
    message: "Files uploaded successfully",
  };
});
