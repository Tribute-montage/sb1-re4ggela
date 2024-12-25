```typescript
import React from 'react';
import { Clock, Music, Image as ImageIcon, Film } from 'lucide-react';
import { usePricing } from '../../hooks/usePricing';
import { PricingBreakdown } from './PricingBreakdown';
import { cn } from '../../lib/utils';

interface PricingOptionsProps {
  onPriceChange?: (total: number) => void;
}

export function PricingOptions({ onPriceChange }: PricingOptionsProps) {
  const { options, updateOptions, pricing } = usePricing();

  React.useEffect(() => {
    onPriceChange?.(pricing.total);
  }, [pricing.total, onPriceChange]);

  return (
    <div className="space-y-6">
      {/* Video Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Video Type
        </label>
        <div className="grid grid-cols-2 gap-4">
          {['6min-basic', '6min-scenery', '9min-basic', '9min-scenery'].map((type) => (
            <button
              key={type}
              onClick={() => updateOptions({ videoType: type as any })}
              className={cn(
                "p-4 border rounded-lg text-left",
                options.videoType === type
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-200 hover:border-indigo-200"
              )}
            >
              <span className="block font-medium">
                {type.replace('-', ' ').replace(/(^\w|\s\w)/g, l => l.toUpperCase())}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Rush Processing */}
      <div>
        <button
          onClick={() => updateOptions({ isRush: !options.isRush })}
          className={cn(
            "w-full p-4 border rounded-lg flex items-center justify-between",
            options.isRush
              ? "border-yellow-500 bg-yellow-50"
              : "border-gray-200 hover:border-yellow-200"
          )}
        >
          <div className="flex items-center">
            <Clock className="h-5 w-5 mr-2 text-yellow-500" />
            <span className="font-medium">Rush Processing</span>
          </div>
          <span className="text-sm text-gray-500">
            {options.isRush ? '24-48 hours' : '3-5 business days'}
          </span>
        </button>
      </div>

      {/* Add-ons */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Add-ons
        </label>
        <div className="space-y-3">
          <button
            onClick={() => updateOptions({
              addOns: { 
                ...options.addOns,
                backgroundMusic: !options.addOns?.backgroundMusic,
              },
            })}
            className={cn(
              "w-full p-4 border rounded-lg flex items-center justify-between",
              options.addOns?.backgroundMusic
                ? "border-green-500 bg-green-50"
                : "border-gray-200 hover:border-green-200"
            )}
          >
            <div className="flex items-center">
              <Music className="h-5 w-5 mr-2 text-green-500" />
              <span className="font-medium">Background Music</span>
            </div>
            <span className="text-sm text-gray-500">$29.99</span>
          </button>

          <button
            onClick={() => updateOptions({
              addOns: {
                ...options.addOns,
                scenery: !options.addOns?.scenery,
              },
            })}
            className={cn(
              "w-full p-4 border rounded-lg flex items-center justify-between",
              options.addOns?.scenery
                ? "border-green-500 bg-green-50"
                : "border-gray-200 hover:border-green-200"
            )}
          >
            <div className="flex items-center">
              <Film className="h-5 w-5 mr-2 text-green-500" />
              <span className="font-medium">Scenic Transitions</span>
            </div>
            <span className="text-sm text-gray-500">$39.99</span>
          </button>
        </div>
      </div>

      {/* Price Breakdown */}
      <PricingBreakdown {...options} />
    </div>
  );
}
```