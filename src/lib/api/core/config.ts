// API configuration and constants
export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_SUPABASE_URL,
  maxRetries: 3,
  timeout: 30000,
  defaultHeaders: {
    'Content-Type': 'application/json',
  },
};

export const UPLOAD_CONFIG = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/*', 'video/*'],
  maxConcurrentUploads: 3,
};

export const ERROR_MESSAGES = {
  fileTooLarge: 'File is too large. Maximum size is 10MB',
  invalidFileType: 'Invalid file type. Only images and videos are allowed',
  uploadFailed: 'Failed to upload file',
  networkError: 'Network error. Please check your connection',
};