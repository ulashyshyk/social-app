import { v2 as cloudinary } from "cloudinary";
import { env } from "./env";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export const getCloudinaryPublicId = (url: string): string | null => {
  try {
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;

    let afterUpload = parts[1];
    afterUpload = afterUpload.replace(/^v\d+\//, "");
    afterUpload = afterUpload.split("?")[0];
    afterUpload = afterUpload.replace(/\.[a-zA-Z0-9]+$/, "");

    return afterUpload; // topics/abc
  } catch {
    return null;
  }
};

export default cloudinary;
