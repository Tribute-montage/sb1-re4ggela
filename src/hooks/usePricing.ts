```typescript
import { useState, useCallback } from 'react';
import { calculateOrderPrice, type PricingOptions } from '../lib/pricing/calculator';

export function usePricing(initialOptions?: Partial<PricingOptions>) {
  const [options, setOptions] = useState<PricingOptions>({
    videoType: '6min-basic',
    isRush: false,
    photoCount: 0,
    videoCount: 0,
    addOns: {},
    ...initialOptions,
  });

  const updateOptions = useCallback((updates: Partial<PricingOptions>) => {
    setOptions(prev => ({
      ...prev,
      ...updates,
      addOns: {
        ...prev.addOns,
        ...updates.addOns,
      },
    }));
  }, []);

  const pricing = calculateOrderPrice(options);

  return {
    options,
    updateOptions,
    pricing,
  };
}
```