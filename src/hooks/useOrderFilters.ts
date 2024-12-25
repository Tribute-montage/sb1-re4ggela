```typescript
import { useState, useCallback } from 'react';
import { Order } from '../types/order';

export type OrderFilter = {
  search: string;
  status: string[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  videoType: string[];
};

export function useOrderFilters(orders: Order[]) {
  const [filters, setFilters] = useState<OrderFilter>({
    search: '',
    status: [],
    dateRange: {
      start: null,
      end: null,
    },
    videoType: [],
  });

  const filteredOrders = orders.filter(order => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch = 
        order.orderNumber.toLowerCase().includes(searchTerm) ||
        order.subjectName.toLowerCase().includes(searchTerm) ||
        order.funeralHome.toLowerCase().includes(searchTerm);
      
      if (!matchesSearch) return false;
    }

    // Status filter
    if (filters.status.length > 0 && !filters.status.includes(order.status)) {
      return false;
    }

    // Video type filter
    if (filters.videoType.length > 0 && !filters.videoType.includes(order.videoType)) {
      return false;
    }

    // Date range filter
    if (filters.dateRange.start || filters.dateRange.end) {
      const orderDate = new Date(order.createdAt);
      if (filters.dateRange.start && orderDate < filters.dateRange.start) return false;
      if (filters.dateRange.end && orderDate > filters.dateRange.end) return false;
    }

    return true;
  });

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
      videoType: [],
    });
  }, []);

  return {
    filters,
    updateFilter,
    resetFilters,
    filteredOrders,
  };
}
```