import { supabase } from '../supabase/client';
import { logger } from '../core/logger';

export async function uploadOrderMedia(
  file: File,
  orderId: string,
  onProgress?: (progress: number) => void
): Promise<{ url: string }> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${orderId}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('media')
      .upload(filePath, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(data.path);

    // Simulate progress for better UX
    if (onProgress) {
      for (let i = 1; i <= 10; i++) {
        onProgress((i / 10) * 100);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    return { url: publicUrl };
  } catch (error) {
    logger.error('Error uploading media:', error);
    throw error;
  }
}

export async function getOrderMedia(orderId: string) {
  const { data, error } = await supabase
    .from('order_media')
    .select('*')
    .eq('order_id', orderId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

export async function deleteOrderMedia(mediaId: string) {
  const { error } = await supabase
    .from('order_media')
    .delete()
    .eq('id', mediaId);

  if (error) throw error;
}