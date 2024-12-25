```typescript
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase/client';

interface BusinessMetrics {
  revenue: {
    totalRevenue: number;
    averageOrderValue: number;
    revenueGrowth: number;
    projectedRevenue: number;
  };
  completion: {
    averageCompletionTime: number;
    completionTimeImprovement: number;
    onTimeDeliveryRate: number;
    projectsCompleted: number;
  };
  loading: boolean;
  error?: string;
}

export function useBusinessMetrics() {
  const [metrics, setMetrics] = useState<BusinessMetrics>({
    revenue: {
      totalRevenue: 0,
      averageOrderValue: 0,
      revenueGrowth: 0,
      projectedRevenue: 0,
    },
    completion: {
      averageCompletionTime: 0,
      completionTimeImprovement: 0,
      onTimeDeliveryRate: 0,
      projectsCompleted: 0,
    },
    loading: true,
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [revenueData, completionData] = await Promise.all([
          supabase.rpc('get_revenue_metrics'),
          supabase.rpc('get_completion_metrics'),
        ]);

        if (revenueData.error) throw revenueData.error;
        if (completionData.error) throw completionData.error;

        setMetrics({
          revenue: revenueData.data,
          completion: completionData.data,
          loading: false,
        });
      } catch (error) {
        console.error('Error fetching business metrics:', error);
        setMetrics(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load metrics',
        }));
      }
    };

    fetchMetrics();
  }, []);

  return metrics;
}
```