import React from 'react';
import { FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface AdminStatsProps {
  data: {
    totalOrders: number;
    activeOrders: number;
    completedOrders: number;
    needsAttention: number;
  };
}

export function AdminStats({ data }: AdminStatsProps) {
  const stats = [
    { label: 'Total Orders', value: data.totalOrders, icon: FileText, color: 'text-blue-600' },
    { label: 'Active Orders', value: data.activeOrders, icon: Clock, color: 'text-yellow-600' },
    { label: 'Completed', value: data.completedOrders, icon: CheckCircle, color: 'text-green-600' },
    { label: 'Needs Attention', value: data.needsAttention, icon: AlertCircle, color: 'text-red-600' },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className={cn("h-6 w-6", stat.color)} />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">{stat.label}</dt>
                  <dd className="text-lg font-semibold text-gray-900">{stat.value}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}