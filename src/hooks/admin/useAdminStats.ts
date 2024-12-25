import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase/client';

interface AdminStats {
  totalOrders: number;
  activeOrders: number;
  totalClients: number;
  completedOrders: number;
}

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats>({
    totalOrders: 0,
    activeOrders: 0,
    totalClients: 0,
    completedOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [
          { count: totalOrders },
          { count: activeOrders },
          { count: totalClients },
          { count: completedOrders },
        ] = await Promise.all([
          supabase.from('orders').select('*', { count: 'exact', head: true }),
          supabase.from('orders').select('*', { count: 'exact', head: true })
            .in('status', ['pending', 'in-progress']),
          supabase.from('user_profiles').select('*', { count: 'exact', head: true })
            .eq('role', 'client'),
          supabase.from('orders').select('*', { count: 'exact', head: true })
            .eq('status', 'completed'),
        ]);

        setStats({
          totalOrders: totalOrders || 0,
          activeOrders: activeOrders || 0,
          totalClients: totalClients || 0,
          completedOrders: completedOrders || 0,
        });
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return { stats, loading };
}