```typescript
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase/client';
import { toast } from 'sonner';
import type { Asset } from '../../types/asset';

export function useVerseAssets() {
  const [verses, setVerses] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVerses() {
      try {
        const { data, error } = await supabase
          .from('assets')
          .select('*')
          .eq('type', 'verse')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setVerses(data || []);
      } catch (error) {
        console.error('Error fetching verses:', error);
        toast.error('Failed to load verses');
      } finally {
        setLoading(false);
      }
    }

    fetchVerses();
  }, []);

  const createVerse = useCallback(async (
    name: string,
    content: string,
    tags: string[] = []
  ) => {
    try {
      const { error } = await supabase
        .from('assets')
        .insert({
          type: 'verse',
          name,
          content,
          tags,
        });

      if (error) throw error;
      toast.success('Verse created successfully');
    } catch (error) {
      console.error('Error creating verse:', error);
      toast.error('Failed to create verse');
      throw error;
    }
  }, []);

  const updateVerse = useCallback(async (
    id: string,
    updates: Partial<Pick<Asset, 'name' | 'content' | 'tags'>>
  ) => {
    try {
      const { error } = await supabase
        .from('assets')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      toast.success('Verse updated successfully');
    } catch (error) {
      console.error('Error updating verse:', error);
      toast.error('Failed to update verse');
      throw error;
    }
  }, []);

  const deleteVerse = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('assets')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Verse deleted successfully');
    } catch (error) {
      console.error('Error deleting verse:', error);
      toast.error('Failed to delete verse');
      throw error;
    }
  }, []);

  return {
    verses,
    loading,
    createVerse,
    updateVerse,
    deleteVerse,
  };
}
```