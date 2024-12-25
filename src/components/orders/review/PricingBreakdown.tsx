import React from 'react';
import { calculateOrderPrice } from '../../../lib/validation/rules/pricing';
import { cn } from '../../../lib/utils';

interface PricingBreakdownProps {
  orderDetails: any;
}

export function PricingBreakdown({ orderDetails }: PricingBreakdownProps) {
  const basePrice = calculateOrderPrice(
    orderDetails.videoType,
    false,
    orderDetails.mediaFiles?.length || 0,
    0
  );

  const items = [
    { label: 'Base Price', amount: basePrice },
    { label: 'Additional Photos', amount: 0 },
    { label: 'Additional Videos', amount: 0 },
    { label: 'Rush Service', amount: 0 },
  ];

  const total = items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Pricing Breakdown</h3>
        <dl className="space-y-4">
          {items.map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <dt className="text-sm text-gray-600">{item.label}</dt>
              <dd className="text-sm font-medium text-gray-900">
                ${item.amount.toFixed(2)}
              </dd>
            </div>
          ))}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <dt className="text-base font-medium text-gray-900">Total</dt>
              <dd className="text-base font-medium text-gray-900">
                ${total.toFixed(2)}
              </dd>
            </div>
          </div>
        </dl>
      </div>
    </div>
  );
}