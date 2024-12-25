import type { EditorStats } from '../../../types/editor';

interface Order {
  status: string;
  created_at: string;
  completed_at?: string;
}

export function calculateStats(orders: Order[]): EditorStats {
  const activeOrders = orders.filter(o => ['pending', 'in-progress'].includes(o.status)).length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  
  // Calculate average completion time
  const completedWithDates = orders.filter(o => 
    o.status === 'completed' && o.completed_at
  );
  
  const averageCompletionTime = completedWithDates.length > 0
    ? completedWithDates.reduce((acc, order) => {
        const start = new Date(order.created_at);
        const end = new Date(order.completed_at!);
        return acc + (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
      }, 0) / completedWithDates.length
    : 0;

  return {
    activeOrders,
    completedOrders,
    averageCompletionTime: Math.round(averageCompletionTime),
    pendingReviews: orders.filter(o => o.status === 'review').length
  };
}