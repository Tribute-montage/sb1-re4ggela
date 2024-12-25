import React from 'react';
import { OrdersTable } from '../../components/orders/OrdersTable';
import { Order } from '../../types/order';
import { supabase } from '../../lib/supabase/client';

export function AdminOrdersList() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchOrders() {
      try {
        const { data: fetchedOrders, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        // Transform snake_case to camelCase for frontend use
        const transformedOrders = fetchedOrders?.map(order => ({
          ...order,
          createdAt: order.created_at,
          updatedAt: order.updated_at,
          requestedDeliveryDate: order.requested_delivery_date,
          orderNumber: order.order_number,
          subjectName: order.subject_name,
          funeralHome: order.funeral_home,
          videoType: order.video_type,
        })) || [];

        setOrders(transformedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  const handleViewOrder = (orderId: string) => {
    // Navigate to order details page
    window.location.href = `/admin/orders/${orderId}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">All Orders</h1>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No orders found.</p>
            </div>
          ) : (
            <OrdersTable orders={orders} onViewOrder={handleViewOrder} />
          )}
        </div>
      </div>
    </div>
  );
}