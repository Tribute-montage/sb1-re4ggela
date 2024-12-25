import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase/client';
import { Asset } from '../types/order';
import { toast } from 'sonner';

export function useAssets(type: Asset['type']) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let subscription: any;

    async function fetchAssets() {
      try {
        const { data, error } = await supabase
          .from('assets')
          .select('*')
          .eq('type', type)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setAssets(data);
      } catch (error) {
        console.error('Error fetching assets:', error);
        toast.error('Failed to load assets');
      } finally {
        setLoading(false);
      }
    }

    // Set up real-time subscription
    subscription = supabase
      .channel(`assets:${type}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'assets',
        filter: `type=eq.${type}`
      }, () => {
        fetchAssets();
      })
      .subscribe();

    fetchAssets();

    return () => {
      subscription?.unsubscribe();
    };
  }, [type]);

  return { assets, loading };
}