import { useState, useCallback } from 'react';
import { useErrorHandler } from './useErrorHandler';
import { validateFileSize, validateFileType } from '../lib/errors/validation';
import { FileUploadError } from '../lib/errors/types';
import { supabase } from '../lib/supabase/client';
import { toast } from 'sonner';

interface UploadOptions {
  orderId: string;
  onProgress?: (progress: number) => void;
}

export function useFileUpload() {
  const [uploading, setUploading] = useState(false);
  const { error, handleError, clearError } = useErrorHandler();

  const uploadFile = useCallback(async (file: File, options: UploadOptions) => {
    setUploading(true);
    clearError();

    try {
      // Validate file
      validateFileSize(file);
      validateFileType(file);

      // Generate file path
      const fileExt = file.name.split('.').pop();
      const filePath = `orders/${options.orderId}/${Date.now()}_${file.name}`;

      // Upload file
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: options.onProgress,
        });

      if (uploadError) {
        throw new FileUploadError('Failed to upload file', {
          originalError: uploadError,
        });
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      toast.success('File uploaded successfully');
      return publicUrl;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setUploading(false);
    }
  }, [handleError, clearError]);

  return {
    uploadFile,
    uploading,
    error,
    clearError,
  };
}