```typescript
import React from 'react';
import { DollarSign, TrendingUp, Clock } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { formatCurrency } from '../../../lib/utils/format';

interface RevenueMetricsProps {
  data: {
    totalRevenue: number;
    averageOrderValue: number;
    revenueGrowth: number;
    projectedRevenue: number;
  };
}

export function RevenueMetrics({ data }: RevenueMetricsProps) {
  const metrics = [
    {
      label: 'Total Revenue',
      value: formatCurrency(data.totalRevenue),
      icon: DollarSign,
      color: 'text-green-600',
    },
    {
      label: 'Average Order Value',
      value: formatCurrency(data.averageOrderValue),
      icon: TrendingUp,
      color: 'text-blue-600',
    },
    {
      label: 'Revenue Growth',
      value: `${data.revenueGrowth}%`,
      icon: Clock,
      color: 'text-indigo-600',
      trend: data.revenueGrowth >= 0 ? 'up' : 'down',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {metrics.map((metric) => (
        <div key={metric.label} className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <metric.icon className={cn("h-6 w-6", metric.color)} />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {metric.label}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {metric.value}
                    </div>
                    {metric.trend && (
                      <div className={cn(
                        "ml-2 flex items-baseline text-sm font-semibold",
                        metric.trend === 'up' ? "text-green-600" : "text-red-600"
                      )}>
                        {metric.trend === 'up' ? '↑' : '↓'}
                      </div>
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
```