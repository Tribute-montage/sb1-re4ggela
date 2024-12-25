```typescript
import React from 'react';
import { FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface EditorStats {
  activeOrders: number;
  completedOrders: number;
  averageCompletionTime: number;
  pendingReviews: number;
}

interface EditorStatsProps {
  stats: EditorStats;
}

export function EditorStats({ stats }: EditorStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Active Orders"
        value={stats.activeOrders}
        icon={FileText}
        color="text-blue-600"
      />
      <StatCard
        label="Completed Orders"
        value={stats.completedOrders}
        icon={CheckCircle}
        color="text-green-600"
      />
      <StatCard
        label="Avg. Completion Time"
        value={`${stats.averageCompletionTime} days`}
        icon={Clock}
        color="text-indigo-600"
      />
      <StatCard
        label="Pending Reviews"
        value={stats.pendingReviews}
        icon={AlertCircle}
        color="text-yellow-600"
      />
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
}

function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className={cn("h-6 w-6", color)} />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {label}
              </dt>
              <dd className="text-lg font-semibold text-gray-900">
                {value}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
```