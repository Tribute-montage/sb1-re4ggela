```typescript
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase/client';
import { toast } from 'sonner';

export interface Draft {
  id: string;
  orderId: string;
  url: string;
  version: number;
  status: 'pending_review' | 'approved' | 'changes_requested';
  createdAt: string;
}

export interface DraftFeedback {
  id: string;
  draftId: string;
  type: 'approval' | 'change_request';
  comment?: string;
  createdAt: string;
}

export function useDraftReview(orderId: string) {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [feedback, setFeedback] = useState<DraftFeedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDraft() {
      try {
        // Get latest draft
        const { data: draftData, error: draftError } = await supabase
          .from('order_drafts')
          .select('*')
          .eq('order_id', orderId)
          .order('version', { ascending: false })
          .limit(1)
          .single();

        if (draftError && draftError.code !== 'PGRST116') throw draftError;

        if (draftData) {
          setDraft(draftData);

          // Get feedback for this draft
          const { data: feedbackData, error: feedbackError } = await supabase
            .from('draft_feedback')
            .select('*')
            .eq('draft_id', draftData.id)
            .order('created_at', { ascending: true });

          if (feedbackError) throw feedbackError;
          setFeedback(feedbackData || []);
        }
      } catch (error) {
        console.error('Error fetching draft:', error);
        toast.error('Failed to load draft');
      } finally {
        setLoading(false);
      }
    }

    fetchDraft();

    // Set up real-time subscription for feedback
    const subscription = supabase
      .channel(`draft_feedback:${orderId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'draft_feedback',
        filter: `draft_id=eq.${draft?.id}`,
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setFeedback(prev => [...prev, payload.new as DraftFeedback]);
          
          // Show notification for new feedback
          toast.info('New feedback received');
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [orderId, draft?.id]);

  const uploadDraft = useCallback(async (file: File) => {
    try {
      const version = draft ? draft.version + 1 : 1;
      const filePath = `drafts/${orderId}/${version}_${file.name}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('drafts')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('drafts')
        .getPublicUrl(filePath);

      // Create draft record
      const { error: draftError } = await supabase
        .from('order_drafts')
        .insert({
          order_id: orderId,
          url: publicUrl,
          version,
          status: 'pending_review',
        });

      if (draftError) throw draftError;

      toast.success('Draft uploaded successfully');
    } catch (error) {
      console.error('Error uploading draft:', error);
      toast.error('Failed to upload draft');
      throw error;
    }
  }, [orderId, draft]);

  return {
    draft,
    feedback,
    loading,
    uploadDraft,
  };
}
```