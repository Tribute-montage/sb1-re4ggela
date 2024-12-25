import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Edit } from 'lucide-react';
import { useOrder } from '../../hooks/useOrder';
import { OrderStatusBadge } from '../../components/orders/OrderStatusBadge';
import { OrderTimeline } from '../../components/orders/OrderTimeline';
import { OrderMedia } from '../../components/orders/OrderMedia';

export function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { order, loading } = useOrder(orderId!);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Order not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate('/orders')}
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Orders
        </button>
        <button
          onClick={() => navigate(`/orders/${orderId}/edit`)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Edit className="h-5 w-5 mr-2" />
          Edit Order
        </button>
      </div>

      <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
        {/* Header */}
        <div className="px-6 py-5">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Order #{order.orderNumber}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Created on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>
        </div>

        {/* Details */}
        <div className="px-6 py-5">
          <h3 className="text-lg font-medium text-gray-900">Order Details</h3>
          <dl className="mt-4 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Subject Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{order.subjectName}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Video Type</dt>
              <dd className="mt-1 text-sm text-gray-900">{order.videoType}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Delivery Date</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(order.requestedDeliveryDate).toLocaleDateString()}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Special Notes</dt>
              <dd className="mt-1 text-sm text-gray-900">{order.specialNotes || 'None'}</dd>
            </div>
          </dl>
        </div>

        {/* Media */}
        <div className="px-6 py-5">
          <OrderMedia orderId={orderId!} />
        </div>

        {/* Timeline */}
        <div className="px-6 py-5">
          <OrderTimeline orderId={orderId!} />
        </div>
      </div>
    </div>
  );
}