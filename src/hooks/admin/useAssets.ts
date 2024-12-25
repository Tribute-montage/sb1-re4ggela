```typescript
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase/client';
import { toast } from 'sonner';
import type { Asset } from '../../types/asset';

export function useAssets(type: Asset['type']) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAssets() {
      try {
        const { data, error } = await supabase
          .from('assets')
          .select('*')
          .eq('type', type)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setAssets(data || []);
      } catch (error) {
        console.error('Error fetching assets:', error);
        toast.error('Failed to load assets');
      } finally {
        setLoading(false);
      }
    }

    fetchAssets();
  }, [type]);

  const deleteAsset = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('assets')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAssets(prev => prev.filter(asset => asset.id !== id));
      toast.success('Asset deleted successfully');
    } catch (error) {
      console.error('Error deleting asset:', error);
      toast.error('Failed to delete asset');
    }
  }, []);

  const updateAsset = useCallback(async (id: string, updates: Partial<Asset>) => {
    try {
      const { error } = await supabase
        .from('assets')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setAssets(prev =>
        prev.map(asset =>
          asset.id === id ? { ...asset, ...updates } : asset
        )
      );
      toast.success('Asset updated successfully');
    } catch (error) {
      console.error('Error updating asset:', error);
      toast.error('Failed to update asset');
    }
  }, []);

  return {
    assets,
    loading,
    deleteAsset,
    updateAsset,
  };
}
```