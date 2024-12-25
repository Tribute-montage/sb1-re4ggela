import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase/client';
import { useAuthStore } from '../store/useAuthStore';
import { Asset } from '../types/order';
import { toast } from 'sonner';

export function useFavorites() {
  const { user } = useAuthStore();
  const [favorites, setFavorites] = useState<Record<Asset['type'], string[]>>({
    music: [],
    cover: [],
    scenery: [],
    verse: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchFavorites() {
      try {
        const { data, error } = await supabase
          .from('user_favorites')
          .select('asset_id, assets(type)')
          .eq('user_id', user.id);

        if (error) throw error;

        const groupedFavorites = data.reduce((acc, fav) => {
          const type = fav.assets.type;
          acc[type] = [...(acc[type] || []), fav.asset_id];
          return acc;
        }, {} as Record<Asset['type'], string[]>);

        setFavorites(groupedFavorites);
      } catch (error) {
        console.error('Error fetching favorites:', error);
        toast.error('Failed to load favorites');
      } finally {
        setLoading(false);
      }
    }

    fetchFavorites();
  }, [user]);

  const toggleFavorite = async (type: Asset['type'], assetId: string) => {
    if (!user) return;

    try {
      const isFavorite = favorites[type]?.includes(assetId);

      if (isFavorite) {
        await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('asset_id', assetId);

        setFavorites(prev => ({
          ...prev,
          [type]: prev[type].filter(id => id !== assetId)
        }));
      } else {
        await supabase
          .from('user_favorites')
          .insert({ user_id: user.id, asset_id: assetId });

        setFavorites(prev => ({
          ...prev,
          [type]: [...(prev[type] || []), assetId]
        }));
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorite');
    }
  };

  return { favorites, loading, toggleFavorite };
}