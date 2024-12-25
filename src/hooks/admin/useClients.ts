import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase/client';
import { toast } from 'sonner';

interface Client {
  id: string;
  name: string;
}

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('id, full_name')
          .eq('role', 'client')
          .order('full_name');

        if (error) throw error;

        setClients(
          data.map(client => ({
            id: client.id,
            name: client.full_name
          }))
        );
      } catch (error) {
        console.error('Error fetching clients:', error);
        toast.error('Failed to load clients');
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  return { clients, loading };
}