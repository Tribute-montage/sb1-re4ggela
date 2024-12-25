import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase/client';
import type { DashboardData } from '../../types/editor';
import { calculateStats } from './utils/statsCalculator';
import { fetchOrders } from './queries/orderQueries';
import { fetchDrafts } from './queries/draftQueries';
import { fetchFeedback } from './queries/feedbackQueries';

export function useEditorDashboard() {
  const [data, setData] = useState<DashboardData>({
    stats: {
      activeOrders: 0,
      completedOrders: 0,
      averageCompletionTime: 0,
      pendingReviews: 0
    },
    orders: [],
    drafts: [],
    feedback: [],
    timeline: [],
    loading: true
  });

  const fetchDashboardData = useCallback(async () => {
    try {
      setData(prev => ({ ...prev, loading: true, error: undefined }));

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      if (!user) throw new Error('Not authenticated');

      const [orders, drafts, feedback] = await Promise.all([
        fetchOrders(user.id),
        fetchDrafts(user.id),
        fetchFeedback(user.id)
      ]);

      const stats = calculateStats(orders);

      setData({
        stats,
        orders,
        drafts,
        feedback,
        timeline: [], // TODO: Implement timeline events
        loading: false
      });
    } catch (error) {
      setData(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred'
      }));
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    ...data,
    refetch: fetchDashboardData
  };
}