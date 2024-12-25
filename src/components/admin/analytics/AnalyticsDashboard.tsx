import React from 'react';
import { RevenueChart } from './charts/RevenueChart';
import { OrderStatusChart } from './charts/OrderStatusChart';
import { ClientMetrics } from './metrics/ClientMetrics';
import { OrderMetrics } from './metrics/OrderMetrics';
import { PerformanceMetrics } from './metrics/PerformanceMetrics';
import { useAnalytics } from '../../../hooks/admin/useAnalytics';
import { Download } from 'lucide-react';
import { cn } from '../../../lib/utils';

export function AnalyticsDashboard() {
  const { data, loading } = useAnalytics();

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-64 bg-gray-200 rounded-lg" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-48 bg-gray-100 rounded-lg" />
          <div className="h-48 bg-gray-100 rounded-lg" />
        </div>
      </div>
    );
  }

  const handleExportData = () => {
    const csvData = [
      ['Metric', 'Value'],
      ['Total Clients', data.clientMetrics.totalClients],
      ['New Clients', data.clientMetrics.newClientsThisMonth],
      ['Retention Rate', `${data.clientMetrics.retentionRate}%`],
      ['Total Orders', data.orderMetrics.totalOrders],
      ['Completed Orders', data.orderMetrics.completedOrders],
      ['Average Completion Time', `${data.orderMetrics.averageCompletionTime}h`],
    ];

    const csv = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analytics-export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Analytics Dashboard</h2>
        <button
          onClick={handleExportData}
          className={cn(
            "inline-flex items-center px-4 py-2 border border-transparent",
            "rounded-md shadow-sm text-sm font-medium text-white",
            "bg-indigo-600 hover:bg-indigo-700"
          )}
        >
          <Download className="h-5 w-5 mr-2" />
          Export Data
        </button>
      </div>

      <PerformanceMetrics data={data.performanceMetrics} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ClientMetrics data={data.clientMetrics} />
        <OrderMetrics data={data.orderMetrics} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={data.revenueData} />
        <OrderStatusChart data={data.statusDistribution} />
      </div>
    </div>
  );
}