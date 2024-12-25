import { useState, useCallback, useMemo } from 'react';
import { supabase } from '../../lib/supabase/client';
import type { Order } from '../../types/order';

export type OrderFilter = {
  search: string;
  status: string[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  clientName: string;
};

export function useAdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<OrderFilter>({
    search: '',
    status: [],
    dateRange: {
      start: null,
      end: null,
    },
    clientName: '',
  });

  const fetchOrders = useCallback(async () => {
    try {
      let query = supabase.from('orders').select('*');

      if (filters.status.length > 0) {
        query = query.in('status', filters.status);
      }

      if (filters.dateRange.start) {
        query = query.gte('created_at', filters.dateRange.start.toISOString());
      }

      if (filters.dateRange.end) {
        query = query.lte('created_at', filters.dateRange.end.toISOString());
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch = 
        order.orderNumber.toLowerCase().includes(searchTerm) ||
        order.funeralHome.toLowerCase().includes(searchTerm) ||
        order.subjectName.toLowerCase().includes(searchTerm);

      const matchesClientName = !filters.clientName || 
        order.funeralHome.toLowerCase().includes(filters.clientName.toLowerCase());

      return matchesSearch && matchesClientName;
    });
  }, [orders, filters]);

  const updateFilter = useCallback((key: keyof OrderFilter, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      status: [],
      dateRange: {
        start: null,
        end: null,
      },
      clientName: '',
    });
  }, []);

  return {
    orders: filteredOrders,
    filters,
    loading,
    updateFilter,
    resetFilters,
    totalOrders: orders.length,
    filteredCount: filteredOrders.length,
  };
}