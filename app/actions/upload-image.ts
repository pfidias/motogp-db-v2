'use server';

import { requireAdmin } from '@/lib/require-admin';
import { type UploadApiErrorResponse } from 'cloudinary';
import { cloudinary } from '@/lib/cloudinary-config';

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
