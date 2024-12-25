import { supabase } from '../supabase/client';
import { Asset } from '../../types/asset';

export async function getAssets(type: Asset['type']) {
  const { data, error } = await supabase
    .from('assets')
    .select('*')
    .eq('type', type)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getFavorites(userId: string) {
  const { data, error } = await supabase
    .from('user_favorites')
    .select('asset_id')
    .eq('user_id', userId);

  if (error) throw error;
  return data.map(f => f.asset_id);
}

export async function toggleFavorite(userId: string, assetId: string) {
  const { data: existing } = await supabase
    .from('user_favorites')
    .select('*')
    .eq('user_id', userId)
    .eq('asset_id', assetId)
    .single();

  if (existing) {
    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', userId)
      .eq('asset_id', assetId);

    if (error) throw error;
    return false;
  } else {
    const { error } = await supabase
      .from('user_favorites')
      .insert({ user_id: userId, asset_id: assetId });

    if (error) throw error;
    return true;
  }
}