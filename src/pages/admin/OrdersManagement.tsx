import React from 'react';
import { OrderFilters } from '../../components/admin/orders/OrderFilters';
import { OrdersTable } from '../../components/admin/orders/OrdersTable';
import { useAdminOrders } from '../../hooks/admin/useAdminOrders';

export function OrdersManagement() {
  const {
    orders,
    filters,
    loading,
    updateFilter,
    resetFilters,
    totalOrders,
    filteredCount,
  } = useAdminOrders();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
      </div>

      <OrderFilters
        filters={filters}
        onUpdateFilter={updateFilter}
        onReset={resetFilters}
        totalOrders={totalOrders}
        filteredCount={filteredCount}
      />

      <OrdersTable orders={orders} loading={loading} />
    </div>
  );
}