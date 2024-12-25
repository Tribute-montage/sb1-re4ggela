import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase/client';

interface Editor {
  id: string;
  name: string;
  email: string;
  activeOrders: number;
}

export function useEditors() {
  const [editors, setEditors] = useState<Editor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEditors() {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select(`
            id,
            full_name,
            email,
            orders:orders(count)
          `)
          .eq('role', 'editor');

        if (error) throw error;

        setEditors(
          data.map(editor => ({
            id: editor.id,
            name: editor.full_name,
            email: editor.email,
            activeOrders: editor.orders?.[0]?.count || 0,
          }))
        );
      } catch (error) {
        console.error('Error fetching editors:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchEditors();
  }, []);

  return { editors, loading };
}