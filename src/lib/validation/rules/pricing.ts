export const VIDEO_PRICING = {
  '6min-basic': {
    basePrice: 199,
    rushFee: 99,
    maxPhotos: 30,
    maxVideos: 2,
    additionalPhotoPrice: 5,
    additionalVideoPrice: 25
  },
  '6min-scenery': {
    basePrice: 249,
    rushFee: 99,
    maxPhotos: 30,
    maxVideos: 2,
    additionalPhotoPrice: 5,
    additionalVideoPrice: 25
  },
  '9min-basic': {
    basePrice: 299,
    rushFee: 149,
    maxPhotos: 45,
    maxVideos: 3,
    additionalPhotoPrice: 5,
    additionalVideoPrice: 25
  },
  '9min-scenery': {
    basePrice: 349,
    rushFee: 149,
    maxPhotos: 45,
    maxVideos: 3,
    additionalPhotoPrice: 5,
    additionalVideoPrice: 25
  },
  'custom': {
    basePrice: 499,
    rushFee: 199,
    maxPhotos: 60,
    maxVideos: 4,
    additionalPhotoPrice: 5,
    additionalVideoPrice: 25
  }
} as const;

export const calculateOrderPrice = (
  videoType: keyof typeof VIDEO_PRICING,
  isRush: boolean,
  photoCount: number,
  videoCount: number
): number => {
  const pricing = VIDEO_PRICING[videoType];
  const basePrice = pricing.basePrice;
  const rushFee = isRush ? pricing.rushFee : 0;
  
  const extraPhotos = Math.max(0, photoCount - pricing.maxPhotos);
  const extraVideos = Math.max(0, videoCount - pricing.maxVideos);
  
  const additionalPhotoFee = extraPhotos * pricing.additionalPhotoPrice;
  const additionalVideoFee = extraVideos * pricing.additionalVideoPrice;
  
  return basePrice + rushFee + additionalPhotoFee + additionalVideoFee;
};