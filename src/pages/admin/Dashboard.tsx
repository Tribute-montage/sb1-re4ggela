import React from 'react';
import { AdminStats } from '../../components/admin/dashboard/AdminStats';
import { OrderStatusChart } from '../../components/admin/dashboard/OrderStatusChart';
import { RecentOrders } from '../../components/admin/dashboard/RecentOrders';
import { QuickActions } from '../../components/admin/dashboard/QuickActions';
import { PerformanceMetrics } from '../../components/admin/dashboard/PerformanceMetrics';
import { useAnalytics } from '../../hooks/admin/useAnalytics';

export function AdminDashboard() {
  const { data, loading, error } = useAnalytics();

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-24 bg-gray-200 rounded-lg" />
        <div className="h-64 bg-gray-200 rounded-lg" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-48 bg-gray-100 rounded-lg" />
          <div className="h-48 bg-gray-100 rounded-lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      </div>

      <QuickActions />
      
      <AdminStats data={data.orderMetrics} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrderStatusChart data={data.statusDistribution} />
        <PerformanceMetrics data={data.performanceMetrics} />
      </div>

      <RecentOrders />
    </div>
  );
}