import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { OrdersTable } from '../../components/orders/OrdersTable';
import { OrderCategories } from '../../components/orders/OrderCategories';
import { useOrders } from '../../hooks/useOrders';

export function OrdersList() {
  const navigate = useNavigate();
  const { orders, loading } = useOrders();
  const [selectedCategory, setSelectedCategory] = React.useState('active');

  const filteredOrders = React.useMemo(() => {
    switch (selectedCategory) {
      case 'active':
        return orders.filter(o => ['pending', 'in-progress'].includes(o.status));
      case 'completed':
        return orders.filter(o => o.status === 'completed');
      case 'attention':
        return orders.filter(o => o.status === 'review');
      default:
        return orders;
    }
  }, [orders, selectedCategory]);

  const handleViewOrder = (orderId: string) => {
    navigate(`/orders/${orderId}`);
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
        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
        <button
          onClick={() => navigate('/orders/new')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          New Order
        </button>
      </div>

      <OrderCategories
        orders={orders}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No orders found in this category.</p>
            </div>
          ) : (
            <OrdersTable orders={filteredOrders} onViewOrder={handleViewOrder} />
          )}
        </div>
      </div>
    </div>
  );
}