import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase/client';
import { toast } from 'sonner';

export interface MediaReviewItem {
  id: string;
  mediaId: string;
  status: 'pending' | 'approved' | 'rejected' | 'reupload_requested';
  feedback?: string;
  media: {
    url: string;
    fileName: string;
    contentType: string;
    thumbnail?: string;
  };
}

export interface MediaReview {
  id: string;
  orderId: string;
  status: 'pending' | 'approved' | 'rejected' | 'reupload_requested';
  notes?: string;
  items: MediaReviewItem[];
  createdAt: string;
  updatedAt: string;
}

export function useMediaReview(orderId: string) {
  const [review, setReview] = useState<MediaReview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReview() {
      try {
        // Get active review
        const { data: reviewData, error: reviewError } = await supabase
          .from('media_reviews')
          .select(`
            *,
            items:media_review_items(
              *,
              media:order_media(*)
            )
          `)
          .eq('order_id', orderId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (reviewError && reviewError.code !== 'PGRST116') throw reviewError;
        setReview(reviewData);
      } catch (error) {
        console.error('Error fetching media review:', error);
        toast.error('Failed to load review');
      } finally {
        setLoading(false);
      }
    }

    fetchReview();
  }, [orderId]);

  const startReview = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .rpc('start_media_review', {
          p_order_id: orderId,
          p_reviewer_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;
      toast.success('Review started');
      return data;
    } catch (error) {
      console.error('Error starting review:', error);
      toast.error('Failed to start review');
      throw error;
    }
  }, [orderId]);

  const updateItemStatus = useCallback(async (
    itemId: string,
    status: MediaReviewItem['status'],
    feedback?: string
  ) => {
    try {
      const { error } = await supabase
        .from('media_review_items')
        .update({
          status,
          feedback
        })
        .eq('id', itemId);

      if (error) throw error;
      
      setReview(prev => prev ? {
        ...prev,
        items: prev.items.map(item =>
          item.id === itemId ? { ...item, status, feedback } : item
        )
      } : null);

      toast.success('Review item updated');
    } catch (error) {
      console.error('Error updating review item:', error);
      toast.error('Failed to update review item');
    }
  }, []);

  const completeReview = useCallback(async (
    status: MediaReview['status'],
    notes?: string
  ) => {
    if (!review) return;

    try {
      const { error } = await supabase
        .rpc('complete_media_review', {
          p_review_id: review.id,
          p_status: status,
          p_notes: notes
        });

      if (error) throw error;
      toast.success('Review completed');
    } catch (error) {
      console.error('Error completing review:', error);
      toast.error('Failed to complete review');
    }
  }, [review]);

  return {
    review,
    loading,
    startReview,
    updateItemStatus,
    completeReview
  };
}