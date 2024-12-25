```typescript
import React from 'react';
import { useOrderStatus } from '../../hooks/useOrderStatus';
import { Clock, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface OrderStatusIndicatorProps {
  orderId: string;
}

export function OrderStatusIndicator({ orderId }: OrderStatusIndicatorProps) {
  const { status, loading } = useOrderStatus(orderId);

  if (loading) {
    return (
      <div className="flex items-center text-gray-500">
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        Loading status...
      </div>
    );
  }

  const statusConfig = {
    pending: {
      icon: Clock,
      color: 'text-yellow-500',
      bg: 'bg-yellow-50',
      label: 'Pending',
    },
    'in-progress': {
      icon: Loader2,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
      label: 'In Progress',
    },
    review: {
      icon: AlertTriangle,
      color: 'text-purple-500',
      bg: 'bg-purple-50',
      label: 'In Review',
    },
    completed: {
      icon: CheckCircle,
      color: 'text-green-500',
      bg: 'bg-green-50',
      label: 'Completed',
    },
  }[status || 'pending'];

  const Icon = statusConfig.icon;

  return (
    <div className={cn(
      "inline-flex items-center px-3 py-1 rounded-full",
      statusConfig.bg
    )}>
      <Icon className={cn("h-4 w-4 mr-2", statusConfig.color)} />
      <span className={cn("text-sm font-medium", statusConfig.color)}>
        {statusConfig.label}
      </span>
    </div>
  );
}
```