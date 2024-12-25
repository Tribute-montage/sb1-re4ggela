import React from 'react';
import { useAnalytics } from '../../hooks/admin/useAnalytics';
import { RevenueChart } from '../../components/admin/analytics/RevenueChart';
import { OrderStatusChart } from '../../components/admin/analytics/OrderStatusChart';
import { PerformanceMetrics } from '../../components/admin/analytics/PerformanceMetrics';
import { AnalyticsError } from '../../components/admin/analytics/AnalyticsError';
import { AnalyticsLoading } from '../../components/admin/analytics/AnalyticsLoading';
import { Download } from 'lucide-react';
import { cn } from '../../lib/utils';
import { PageLayout } from '../../components/layout/PageLayout';

export function Analytics() {
  const { data, loading, error, refetch } = useAnalytics();

  const handleExportData = () => {
    if (!data) return;

    const csvData = [
      ['Metric', 'Value'],
      ['Total Orders', data.orderMetrics.totalOrders],
      ['Active Orders', data.orderMetrics.activeOrders],
      ['Completed Orders', data.orderMetrics.completedOrders],
      ['Average Order Value', data.performanceMetrics.averageOrderValue],
      ['Order Growth Rate', `${data.performanceMetrics.orderGrowthRate}%`],
      ['Average Processing Time', `${data.performanceMetrics.processingTime} days`],
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

  if (loading) {
    return <AnalyticsLoading />;
  }

  if (error) {
    return <AnalyticsError message={error} onRetry={refetch} />;
  }

  const exportButton = (
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
  );

  return (
    <PageLayout 
      title="Analytics Dashboard"
      actions={exportButton}
    >
      <PerformanceMetrics data={data.performanceMetrics} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={data.revenueData} />
        <OrderStatusChart data={data.statusDistribution} />
      </div>
    </PageLayout>
  );
}