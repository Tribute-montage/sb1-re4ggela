```typescript
import React from 'react';
import { calculateOrderPrice } from '../../lib/pricing/calculator';
import { formatCurrency } from '../../lib/utils/format';
import { cn } from '../../lib/utils';

interface PricingBreakdownProps {
  videoType: string;
  isRush: boolean;
  photoCount: number;
  videoCount: number;
  addOns: {
    backgroundMusic?: boolean;
    customVerse?: boolean;
    scenery?: boolean;
  };
}

export function PricingBreakdown({
  videoType,
  isRush,
  photoCount,
  videoCount,
  addOns,
}: PricingBreakdownProps) {
  const pricing = calculateOrderPrice({
    videoType: videoType as any,
    isRush,
    photoCount,
    videoCount,
    addOns,
  });

  return (
    <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900">Order Summary</h3>
        
        {/* Base Price */}
        <div className="mt-4 space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-500">Base Price ({videoType})</span>
            <span className="text-gray-900">{formatCurrency(pricing.basePrice)}</span>
          </div>

          {/* Rush Fee */}
          {pricing.rushFee > 0 && (
            <div className="flex justify-between text-yellow-600">
              <span>Rush Processing Fee</span>
              <span>{formatCurrency(pricing.rushFee)}</span>
            </div>
          )}

          {/* Media Fees */}
          {Object.entries(pricing.mediaFees).map(([key, amount]) => 
            amount > 0 && (
              <div key={key} className="flex justify-between text-blue-600">
                <span>{key === 'additionalPhotos' ? 'Additional Photos' : 'Additional Videos'}</span>
                <span>{formatCurrency(amount)}</span>
              </div>
            )
          )}

          {/* Add-ons */}
          {Object.entries(pricing.addOns).map(([key, amount]) => (
            <div key={key} className="flex justify-between text-green-600">
              <span>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
              <span>{formatCurrency(amount)}</span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium text-gray-900">Total</span>
            <span className="text-xl font-semibold text-gray-900">
              {formatCurrency(pricing.total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
```