import React from 'react';
import { FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { StatCard } from './StatCard';
import type { EditorStats as EditorStatsType } from '../../../types/editor';

interface EditorStatsProps {
  stats: EditorStatsType;
}

export function EditorStats({ stats }: EditorStatsProps) {
  const statItems = [
    {
      label: "Active Orders",
      value: stats.activeOrders,
      icon: FileText,
      color: "text-blue-600"
    },
    {
      label: "Completed Orders",
      value: stats.completedOrders,
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      label: "Avg. Completion Time",
      value: `${stats.averageCompletionTime} days`,
      icon: Clock,
      color: "text-indigo-600"
    },
    {
      label: "Pending Reviews",
      value: stats.pendingReviews,
      icon: AlertCircle,
      color: "text-yellow-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {statItems.map((item) => (
        <StatCard key={item.label} {...item} />
      ))}
    </div>
  );
}