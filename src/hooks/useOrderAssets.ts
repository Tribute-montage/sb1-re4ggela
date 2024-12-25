```typescript
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase/client';
import { toast } from 'sonner';

interface OrderAsset {
  id: string;
  type: 'instructions' | 'music' | 'cover' | 'scenery' | 'verse';
  name: string;
  url: string;
  createdAt: string;
}

export function useOrderAssets(orderId: string) {
  const [assets, setAssets] = useState<OrderAsset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAssets() {
      try {
        const { data, error } = await supabase
          .from('order_assets')
          .select('*')
          .eq('order_id', orderId)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setAssets(data || []);
      } catch (error) {
        console.error('Error fetching order assets:', error);
        toast.error('Failed to load project assets');
      } finally {
        setLoading(false);
      }
    }

    fetchAssets();
  }, [orderId]);

  return { assets, loading };
}
```