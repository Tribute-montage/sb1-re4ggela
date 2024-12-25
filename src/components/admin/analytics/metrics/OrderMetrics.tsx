import React from 'react';
import { Clock, CheckCircle, Calendar } from 'lucide-react';
import { formatDuration } from '../../../../lib/utils/format';

interface OrderMetricsProps {
  data: {
    totalOrders: number;
    completedOrders: number;
    averageCompletionTime: number;
  };
}

export function OrderMetrics({ data }: OrderMetricsProps) {
  const metrics = [
    {
      label: 'Total Orders',
      value: data.totalOrders,
      icon: Calendar,
      color: 'text-blue-600',
    },
    {
      label: 'Completed Orders',
      value: data.completedOrders,
      icon: CheckCircle,
      color: 'text-green-600',
    },
    {
      label: 'Avg. Completion Time',
      value: formatDuration(data.averageCompletionTime),
      icon: Clock,
      color: 'text-indigo-600',
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Order Metrics</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <metric.icon className={`h-5 w-5 ${metric.color}`} />
              <span className="ml-2 text-sm text-gray-500">{metric.label}</span>
            </div>
            <p className="mt-2 text-2xl font-semibold text-gray-900">{metric.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}