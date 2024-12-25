import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase/client';
import { toast } from 'sonner';

interface MediaItem {
  id: string;
  orderId: string;
  url: string;
  fileName: string;
  contentType: string;
  size: number;
  notes?: string;
  displayOrder: number;
}

export function useOrderMedia(orderId: string) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let subscription: any;

    async function fetchMedia() {
      try {
        const { data, error } = await supabase
          .from('order_media')
          .select('*')
          .eq('order_id', orderId)
          .order('display_order', { ascending: true });

        if (error) throw error;
        setMedia(data);
      } catch (error) {
        console.error('Error fetching media:', error);
        toast.error('Failed to load media files');
      } finally {
        setLoading(false);
      }
    }

    // Set up real-time subscription
    subscription = supabase
      .channel(`media:${orderId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'order_media',
        filter: `order_id=eq.${orderId}`
      }, () => {
        fetchMedia();
      })
      .subscribe();

    fetchMedia();

    return () => {
      subscription?.unsubscribe();
    };
  }, [orderId]);

  const deleteMedia = async (mediaId: string) => {
    try {
      const { error } = await supabase
        .from('order_media')
        .delete()
        .eq('id', mediaId);

      if (error) throw error;
      toast.success('Media file deleted');
    } catch (error) {
      console.error('Error deleting media:', error);
      toast.error('Failed to delete media file');
    }
  };

  return { media, loading, deleteMedia };
}