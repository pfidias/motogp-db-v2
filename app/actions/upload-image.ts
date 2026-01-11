'use server';

import { requireAdmin } from '@/lib/require-admin';
import { v2 as cloudinary, type UploadApiErrorResponse } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (data: string, folder: string) => {
  const { error } = await requireAdmin();
  if (error) {
    throw new Error(error);
  }

  try {
    const res = await cloudinary.uploader.upload(data, {
      folder,
      public_id: crypto.randomUUID(),
    });
    return res;
  } catch (error) {
    throw new Error((error as UploadApiErrorResponse).message);
  }
};
