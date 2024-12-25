import React from 'react';
import { cn } from '../../lib/utils';

interface OrderStatusBadgeProps {
  status: 'pending' | 'in-progress' | 'review' | 'completed';
}

const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  review: 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800',
};

const statusLabels = {
  pending: 'Pending',
  'in-progress': 'In Progress',
  review: 'In Review',
  completed: 'Completed',
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <span className={cn(
      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
      statusStyles[status]
    )}>
      {statusLabels[status]}
    </span>
  );
}