import { useState, useCallback } from 'react';
import { uploadOrderMedia } from '../lib/api/media';
import { validateFile } from '../lib/api/core/validation';
import { logger } from '../lib/api/core/logger';
import { toast } from 'sonner';

export interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  url?: string;
}

export function useUpload(orderId: string) {
  const [files, setFiles] = useState<UploadFile[]>([]);

  const upload = useCallback(async (file: File) => {
    const id = `${Date.now()}_${file.name}`;
    
    try {
      validateFile(file);
      
      setFiles(prev => [...prev, {
        id,
        file,
        progress: 0,
        status: 'pending'
      }]);

      const response = await uploadOrderMedia(file, orderId, (progress) => {
        setFiles(prev => prev.map(f =>
          f.id === id ? { ...f, progress, status: 'uploading' } : f
        ));
      });

      setFiles(prev => prev.map(f =>
        f.id === id ? { ...f, url: response.url, status: 'completed' } : f
      ));

      toast.success(`${file.name} uploaded successfully`);
      return response.url;
    } catch (error) {
      logger.error('Upload failed', { file: file.name, error });
      setFiles(prev => prev.map(f =>
        f.id === id ? { ...f, status: 'error' } : f
      ));
      toast.error(`Failed to upload ${file.name}`);
      throw error;
    }
  }, [orderId]);

  const remove = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  }, []);

  return {
    files,
    upload,
    remove,
  };
}