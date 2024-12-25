import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Order } from '../../types/order';
import { OrderAnalytics } from './types';

export async function getOrderAnalytics(): Promise<OrderAnalytics> {
  const ordersRef = collection(db, 'orders');
  const snapshot = await getDocs(ordersRef);
  const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const completedOrders = orders.filter(order => order.status === 'completed');
  const averageTime = calculateAverageCompletionTime(completedOrders);
  const revenue = calculateRevenueByMonth(orders);
  const distribution = calculateStatusDistribution(orders);

  return {
    totalOrders: orders.length,
    completedOrders: completedOrders.length,
    averageCompletionTime: averageTime,
    revenueByMonth: revenue,
    statusDistribution: distribution,
  };
}

function calculateAverageCompletionTime(orders: Order[]): number {
  if (orders.length === 0) return 0;
  
  const times = orders.map(order => {
    const start = new Date(order.createdAt);
    const end = new Date(order.updatedAt);
    return end.getTime() - start.getTime();
  });
  
  return times.reduce((acc, time) => acc + time, 0) / times.length / (1000 * 60 * 60 * 24); // Convert to days
}

function calculateRevenueByMonth(orders: Order[]): Record<string, number> {
  return orders.reduce((acc, order) => {
    const date = new Date(order.createdAt);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    acc[monthKey] = (acc[monthKey] || 0) + getOrderAmount(order);
    return acc;
  }, {} as Record<string, number>);
}

function calculateStatusDistribution(orders: Order[]): Record<string, number> {
  return orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

function getOrderAmount(order: Order): number {
  const basePrice = {
    '6min-basic': 199,
    '6min-scenery': 249,
    '9min-basic': 299,
    '9min-scenery': 349,
  }[order.videoType] || 0;

  return basePrice;
}