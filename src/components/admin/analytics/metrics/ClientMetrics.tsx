import React from 'react';
import { Users, UserPlus, RefreshCw } from 'lucide-react';
import { formatPercent } from '../../../../lib/utils/format';

interface ClientMetricsProps {
  data: {
    totalClients: number;
    newClientsThisMonth: number;
    retentionRate: number;
  };
}

export function ClientMetrics({ data }: ClientMetricsProps) {
  const metrics = [
    {
      label: 'Total Clients',
      value: data.totalClients,
      icon: Users,
      color: 'text-blue-600',
    },
    {
      label: 'New Clients (This Month)',
      value: data.newClientsThisMonth,
      icon: UserPlus,
      color: 'text-green-600',
    },
    {
      label: 'Client Retention Rate',
      value: formatPercent(data.retentionRate),
      icon: RefreshCw,
      color: 'text-indigo-600',
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Client Metrics</h3>
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