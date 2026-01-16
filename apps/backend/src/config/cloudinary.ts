import { v2 as cloudinary } from "cloudinary";
import { env } from "./env";
import { Readable } from 'stream';

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

export const uploadProfilePicture = (
  buffer: Buffer,
  userId: string
): Promise<{ url: string; publicId: string }> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'profile-pictures',
        public_id: `user-${userId}-${Date.now()}`,
        resource_type: 'image',
        transformation: [
          { width: 400, height: 400, crop: 'fill', gravity: 'face' },
          { quality: 'auto', fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error('Upload failed'));
        } else {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      }
    );

    const readableStream = Readable.from(buffer);
    readableStream.pipe(uploadStream);
  });
};

export const deleteCloudinaryImage = async (imageUrl: string): Promise<void> => {
  try {
    const publicId = getCloudinaryPublicId(imageUrl);
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
      console.log(`Deleted image: ${publicId}`);
    }
  } catch (error) {
    console.error('Failed to delete from Cloudinary:', error);
  }
};

export default cloudinary;
