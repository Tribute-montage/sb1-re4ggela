import { useState, useCallback } from 'react';
import { encryptFile } from '../lib/security/encryption';
import { hasPermission } from '../lib/security/permissions';
import { useAuthStore } from '../store/useAuthStore';
import { supabase } from '../lib/supabase/client';
import { toast } from 'sonner';

export function useSecureUpload() {
  const [uploading, setUploading] = useState(false);
  const { user } = useAuthStore();

  const uploadFile = useCallback(async (
    file: File,
    orderId: string
  ): Promise<string> => {
    if (!user) throw new Error('Not authenticated');

    // Check permission
    const canUpload = await hasPermission(user.id, 'upload_media');
    if (!canUpload) {
      throw new Error('Permission denied');
    }

    setUploading(true);
    try {
      // Encrypt file
      const { encryptedData, metadata } = await encryptFile(file);

      // Generate secure filename
      const fileExt = file.name.split('.').pop();
      const secureFilename = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `orders/${orderId}/${secureFilename}`;

      // Upload encrypted file
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, encryptedData, {
          contentType: 'application/octet-stream', // Hide original mime type
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Store metadata
      const { error: metadataError } = await supabase
        .from('order_media')
        .insert({
          order_id: orderId,
          file_path: filePath,
          metadata: {
            ...metadata,
            encrypted: true,
          },
        });

      if (metadataError) throw metadataError;

      toast.success('File uploaded securely');
      return filePath;
    } catch (error) {
      console.error('Secure upload failed:', error);
      toast.error('Failed to upload file securely');
      throw error;
    } finally {
      setUploading(false);
    }
  }, [user]);

  return {
    uploadFile,
    uploading,
  };
}