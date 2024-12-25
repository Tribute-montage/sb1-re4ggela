export interface StatusDistribution {
  status: string;
  count: number;
}

export interface OrderMetrics {
  totalOrders: number;
  activeOrders: number;
  completedOrders: number;
  needsAttention: number;
}

export interface PerformanceMetrics {
  averageOrderValue: number;
  orderGrowthRate: number;
  processingTime: number;
}