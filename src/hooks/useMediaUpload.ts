import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabase/client';
import { toast } from 'sonner';

export interface MediaFile {
  id: string;
  file: File;
  type: 'image' | 'video';
  preview: string;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  progress: number;
  url?: string;
  notes: string;
  order: number;
}

export function useMediaUpload(orderId: string) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const addFiles = useCallback((newFiles: File[]) => {
    const mediaFiles: MediaFile[] = newFiles.map((file, index) => ({
      id: uuidv4(),
      file,
      type: file.type.startsWith('image/') ? 'image' : 'video',
      preview: URL.createObjectURL(file),
      status: 'pending',
      progress: 0,
      notes: '',
      order: files.length + index,
    }));

    setFiles(prev => [...prev, ...mediaFiles]);

    // Start uploading each file
    mediaFiles.forEach(uploadFile);
  }, [files.length]);

  const uploadFile = async (mediaFile: MediaFile) => {
    try {
      setFiles(prev => prev.map(f => 
        f.id === mediaFile.id ? { ...f, status: 'uploading' } : f
      ));

      const filePath = `${orderId}/${mediaFile.id}-${mediaFile.file.name}`;
      const { error: uploadError, data } = await supabase.storage
        .from('media')
        .upload(filePath, mediaFile.file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(data.path);

      setFiles(prev => prev.map(f =>
        f.id === mediaFile.id ? {
          ...f,
          status: 'completed',
          progress: 100,
          url: publicUrl,
        } : f
      ));

      updateUploadProgress();
    } catch (error) {
      console.error('Upload error:', error);
      setFiles(prev => prev.map(f =>
        f.id === mediaFile.id ? { ...f, status: 'error' } : f
      ));
      toast.error(`Failed to upload ${mediaFile.file.name}`);
    }
  };

  const updateUploadProgress = () => {
    const totalFiles = files.length;
    const completedFiles = files.filter(f => f.status === 'completed').length;
    const progress = Math.round((completedFiles / totalFiles) * 100);
    setUploadProgress(progress);
  };

  const removeFile = useCallback((id: string) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== id);
    });
    updateUploadProgress();
  }, []);

  const updateFileNotes = useCallback((id: string, notes: string) => {
    setFiles(prev => prev.map(f =>
      f.id === id ? { ...f, notes } : f
    ));
  }, []);

  const reorderFiles = useCallback((activeId: string, overId: string) => {
    setFiles(prev => {
      const oldIndex = prev.findIndex(f => f.id === activeId);
      const newIndex = prev.findIndex(f => f.id === overId);

      const newFiles = [...prev];
      const [movedFile] = newFiles.splice(oldIndex, 1);
      newFiles.splice(newIndex, 0, movedFile);

      return newFiles.map((file, index) => ({
        ...file,
        order: index,
      }));
    });
  }, []);

  return {
    files,
    addFiles,
    removeFile,
    updateFileNotes,
    reorderFiles,
    uploadProgress,
  };
}