import { supabase } from '../../supabase/client';

export async function getStatusDistribution() {
  const { data, error } = await supabase.rpc('get_status_distribution');
  if (error) throw error;
  return data;
}