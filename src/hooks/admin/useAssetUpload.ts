```typescript
import { useState, useCallback } from 'react';
import { supabase } from '../../lib/supabase/client';
import { toast } from 'sonner';
import type { Asset } from '../../types/asset';

export function useAssetUpload() {
  const [uploading, setUploading] = useState(false);

  const uploadAsset = useCallback(async (
    file: File,
    type: Asset['type'],
    tags: string[]
  ) => {
    setUploading(true);
    try {
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${type}/${Date.now()}_${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from('assets')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('assets')
        .getPublicUrl(fileName);

      // Create asset record
      const { error: assetError } = await supabase
        .from('assets')
        .insert({
          type,
          name: file.name.replace(`.${fileExt}`, ''),
          url: publicUrl,
          tags,
          duration: type === 'music' ? await getAudioDuration(file) : null,
        });

      if (assetError) throw assetError;

      toast.success('Asset uploaded successfully');
    } catch (error) {
      console.error('Error uploading asset:', error);
      toast.error('Failed to upload asset');
      throw error;
    } finally {
      setUploading(false);
    }
  }, []);

  return {
    uploadAsset,
    uploading,
  };
}

async function getAudioDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const audio = new Audio();
    audio.src = URL.createObjectURL(file);
    audio.onloadedmetadata = () => {
      URL.revokeObjectURL(audio.src);
      resolve(audio.duration);
    };
  });
}
```