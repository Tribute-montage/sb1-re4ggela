import { Cloudinary } from '@cloudinary/url-gen';
import { supabase } from './config';

const cloudinary = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  },
  url: {
    secure: true,
  },
});

export interface UploadResponse {
  publicId: string;
  url: string;
  format: string;
  width?: number;
  height?: number;
  duration?: number;
}

export async function uploadMedia(
  file: File,
  options = {}
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'tribute_montage');
  
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/auto/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error('Upload failed');
  }

  const data = await response.json();

  // Store reference in Supabase
  const { error } = await supabase.from('media').insert({
    public_id: data.public_id,
    url: data.secure_url,
    format: data.format,
    width: data.width,
    height: data.height,
    duration: data.duration,
    metadata: data,
  });

  if (error) throw error;

  return {
    publicId: data.public_id,
    url: data.secure_url,
    format: data.format,
    width: data.width,
    height: data.height,
    duration: data.duration,
  };
}

export function getOptimizedUrl(publicId: string, options = {}) {
  return cloudinary
    .image(publicId)
    .format('auto')
    .quality('auto')
    .toURL();
}

export async function deleteMedia(publicId: string) {
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/delete_by_token`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ public_id: publicId }),
    }
  );

  if (!response.ok) {
    throw new Error('Delete failed');
  }

  // Remove reference from Supabase
  const { error } = await supabase
    .from('media')
    .delete()
    .match({ public_id: publicId });

  if (error) throw error;
}