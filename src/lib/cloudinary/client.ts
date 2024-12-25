import { Cloudinary } from '@cloudinary/url-gen';

if (!import.meta.env.VITE_CLOUDINARY_CLOUD_NAME) {
  throw new Error('Missing Cloudinary environment variables');
}

export const cloudinary = new Cloudinary({
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