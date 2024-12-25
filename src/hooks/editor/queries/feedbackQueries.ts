import { supabase } from '../../../lib/supabase/client';
import type { Feedback } from '../../../types/editor';

export async function fetchFeedback(userId: string): Promise<Feedback[]> {
  const { data, error } = await supabase
    .rpc('get_draft_feedback', { p_user_id: userId });

  if (error) throw error;
  return data || [];
}