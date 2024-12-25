import { useState, useCallback } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { getOrders, createOrder, updateOrder } from '../lib/api/orders';
import { Order } from '../types/order';
import { toast } from 'sonner';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  const fetchOrders = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await getOrders(user.id);
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createNewOrder = useCallback(async (orderData: Omit<Order, 'id'>) => {
    try {
      const order = await createOrder(orderData);
      setOrders(prev => [order, ...prev]);
      toast.success('Order created successfully');
      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to create order');
      throw error;
    }
  }, []);

  const updateOrderStatus = useCallback(async (
    orderId: string,
    status: Order['status']
  ) => {
    try {
      const updated = await updateOrder(orderId, { status });
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, status } : order
        )
      );
      toast.success('Order status updated');
      return updated;
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order status');
      throw error;
    }
  }, []);

  return {
    orders,
    loading,
    fetchOrders,
    createOrder: createNewOrder,
    updateOrderStatus,
  };
}