import { v4 as uuidv4 } from "uuid";
import { put, del } from "@vercel/blob";

export const saveFile = async (file) => {
  if (!file) return null;

  const [, ext] = file.mimetype.split("/");
  const fileName = uuidv4() + "." + ext;
  const fileData = file.data;

  const blob = await put(fileName, fileData, {
    access: "public",
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  return blob.url;
};

export const deleteFile = async (file) => {
  await del(file, {
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
};
