import { ValidationError } from './types';

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime'];

export function validateFileSize(file: File): void {
  if (file.size > MAX_FILE_SIZE) {
    throw new ValidationError(
      'File size exceeds maximum limit of 100MB',
      'file',
      { size: file.size, maxSize: MAX_FILE_SIZE }
    );
  }
}

export function validateFileType(file: File): void {
  const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
  const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);

  if (!isImage && !isVideo) {
    throw new ValidationError(
      'Unsupported file type. Please upload JPG, PNG, GIF, or MP4 files.',
      'file',
      { type: file.type, allowedTypes: [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES] }
    );
  }
}

export function validateRequiredFields(data: Record<string, any>, requiredFields: string[]): void {
  for (const field of requiredFields) {
    if (!data[field]) {
      throw new ValidationError(
        `${field.charAt(0).toUpperCase() + field.slice(1)} is required`,
        field
      );
    }
  }
}