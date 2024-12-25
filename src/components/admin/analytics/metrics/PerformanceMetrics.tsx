import React from 'react';
import { TrendingUp, Clock, DollarSign } from 'lucide-react';
import { formatCurrency, formatPercent } from '../../../../lib/utils/format';

interface PerformanceMetricsProps {
  data: {
    averageOrderValue: number;
    orderGrowthRate: number;
    processingTime: number;
  };
}

export function PerformanceMetrics({ data }: PerformanceMetricsProps) {
  const metrics = [
    {
      label: 'Average Order Value',
      value: formatCurrency(data.averageOrderValue),
      icon: DollarSign,
      color: 'text-green-600',
      change: '+12.3%',
      trend: 'up',
    },
    {
      label: 'Order Growth Rate',
      value: formatPercent(data.orderGrowthRate),
      icon: TrendingUp,
      color: 'text-blue-600',
      change: '+5.2%',
      trend: 'up',
    },
    {
      label: 'Avg Processing Time',
      value: `${data.processingTime} days`,
      icon: Clock,
      color: 'text-indigo-600',
      change: '-8.1%',
      trend: 'down',
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <metric.icon className={`h-5 w-5 ${metric.color}`} />
                <span className="ml-2 text-sm text-gray-500">{metric.label}</span>
              </div>
              <span className={`text-sm ${
                metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.change}
              </span>
            </div>
            <p className="mt-2 text-2xl font-semibold text-gray-900">{metric.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}