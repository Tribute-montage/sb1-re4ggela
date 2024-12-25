```typescript
import { VIDEO_PRICING } from '../validation/rules/pricing';

export interface PricingOptions {
  videoType: keyof typeof VIDEO_PRICING;
  isRush: boolean;
  photoCount: number;
  videoCount: number;
  addOns?: {
    backgroundMusic?: boolean;
    customVerse?: boolean;
    scenery?: boolean;
  };
}

export function calculateOrderPrice(options: PricingOptions): {
  basePrice: number;
  addOns: Record<string, number>;
  rushFee: number;
  mediaFees: Record<string, number>;
  total: number;
} {
  const pricing = VIDEO_PRICING[options.videoType];
  const basePrice = pricing.basePrice;
  const rushFee = options.isRush ? pricing.rushFee : 0;

  // Calculate additional media fees
  const extraPhotos = Math.max(0, options.photoCount - pricing.maxPhotos);
  const extraVideos = Math.max(0, options.videoCount - pricing.maxVideos);
  const photoFee = extraPhotos * pricing.additionalPhotoPrice;
  const videoFee = extraVideos * pricing.additionalVideoPrice;

  // Calculate add-on fees
  const addOns: Record<string, number> = {};
  if (options.addOns?.backgroundMusic) addOns.backgroundMusic = 29.99;
  if (options.addOns?.customVerse) addOns.customVerse = 19.99;
  if (options.addOns?.scenery) addOns.scenery = 39.99;

  const addOnsTotal = Object.values(addOns).reduce((sum, fee) => sum + fee, 0);
  const mediaFees = {
    additionalPhotos: photoFee,
    additionalVideos: videoFee,
  };

  const total = basePrice + rushFee + photoFee + videoFee + addOnsTotal;

  return {
    basePrice,
    addOns,
    rushFee,
    mediaFees,
    total,
  };
}
```