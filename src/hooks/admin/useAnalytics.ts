import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase/client';
import { toast } from 'sonner';

interface AnalyticsData {
  statusDistribution: Array<{ status: string; count: number }>;
  orderMetrics: {
    totalOrders: number;
    activeOrders: number;
    completedOrders: number;
    needsAttention: number;
  };
  performanceMetrics: {
    averageOrderValue: number;
    orderGrowthRate: number;
    processingTime: number;
  };
}

export function useAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch status distribution
      const { data: statusData, error: statusError } = await supabase
        .from('orders')
        .select('status')
        .then(({ data }) => {
          if (!data) return { data: [] };
          const counts = data.reduce((acc, { status }) => {
            acc[status] = (acc[status] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);
          return {
            data: Object.entries(counts).map(([status, count]) => ({
              status,
              count
            }))
          };
        });

      if (statusError) throw statusError;

      // Fetch order metrics
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('status')
        .then(({ data }) => {
          if (!data) return { data: { totalOrders: 0, activeOrders: 0, completedOrders: 0, needsAttention: 0 } };
          return {
            data: {
              totalOrders: data.length,
              activeOrders: data.filter(o => ['pending', 'in-progress'].includes(o.status)).length,
              completedOrders: data.filter(o => o.status === 'completed').length,
              needsAttention: data.filter(o => o.status === 'review').length
            }
          };
        });

      if (orderError) throw orderError;

      // Fetch performance metrics
      const { data: perfData, error: perfError } = await supabase
        .from('orders')
        .select('created_at, updated_at, status')
        .then(({ data }) => {
          if (!data) return { data: { averageOrderValue: 0, orderGrowthRate: 0, processingTime: 0 } };
          
          const completedOrders = data.filter(o => o.status === 'completed');
          const processingTime = completedOrders.reduce((acc, order) => {
            const start = new Date(order.created_at);
            const end = new Date(order.updated_at);
            return acc + (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
          }, 0) / (completedOrders.length || 1);

          return {
            data: {
              averageOrderValue: 0, // This would come from order_pricing table
              orderGrowthRate: 0, // This would need month-over-month comparison
              processingTime
            }
          };
        });

      if (perfError) throw perfError;

      setData({
        statusDistribution: statusData,
        orderMetrics: orderData,
        performanceMetrics: perfData
      });
    } catch (err) {
      console.error('Analytics error:', err);
      setError('Failed to load analytics data');
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchAnalytics
  };
}