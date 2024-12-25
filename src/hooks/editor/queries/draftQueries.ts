import { supabase } from '../../../lib/supabase/client';
import type { Draft } from '../../../types/editor';

export async function fetchDrafts(userId: string): Promise<Draft[]> {
  const { data, error } = await supabase
    .from('order_drafts')
    .select('*')
    .eq('editor_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}