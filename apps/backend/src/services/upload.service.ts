import cloudinary from "../config/cloudinary";
import fs from "fs";

export const uploadImage = async (filePath: string): Promise<string> => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: "topics",
  });

  fs.unlinkSync(filePath);

  return result.secure_url;
};

export const deleteFromCloudinary = async (publicId: string) => {
  return cloudinary.uploader.destroy(publicId);
};