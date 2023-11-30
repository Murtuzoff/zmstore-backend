import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";

export const uploadFile = (file) => {
  if (!file) return null;

  const [, ext] = file.mimetype.split("/");
  const fileName = uuidv4() + "." + ext;
  const filePath = path.resolve("static", fileName);

  file.mv(filePath);

  return fileName;
};

export const deleteFile = (fileName) => {
  const filePath = path.resolve("static", fileName);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};
