import React from 'react';
import { useNavigate } from 'react-router-dom';
import { OrdersTable } from '../../components/orders/OrdersTable';
import { useOrders } from '../../hooks/useOrders';

export function EditorOrdersList() {
  const navigate = useNavigate();
  const { orders, loading } = useOrders();

  const handleViewOrder = (orderId: string): void => {
    const path = `/editor/orders/${orderId}`;
    navigate(path);
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
        <h1 className="text-2xl font-bold text-gray-900">Assigned Orders</h1>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No orders assigned yet.</p>
            </div>
          ) : (
            <OrdersTable orders={orders} onViewOrder={handleViewOrder} />
          )}
        </div>
      </div>
    </div>
  );
}