// Business hours configuration
export const BUSINESS_HOURS = {
  start: 10, // 10 AM
  end: 18,   // 6 PM
  rushStart: 8, // 8 AM for rush orders
  rushEnd: 20,  // 8 PM for rush orders
  minLeadTime: 24, // hours
  rushLeadTime: 12, // hours
  maxAdvanceBooking: 30, // days
} as const;

export const isWithinBusinessHours = (date: Date, isRush = false): boolean => {
  const hours = date.getHours();
  return isRush 
    ? hours >= BUSINESS_HOURS.rushStart && hours <= BUSINESS_HOURS.rushEnd
    : hours >= BUSINESS_HOURS.start && hours <= BUSINESS_HOURS.end;
};

export const isValidDeliveryDate = (date: Date, isRush = false): boolean => {
  const now = new Date();
  const minLeadTime = isRush ? BUSINESS_HOURS.rushLeadTime : BUSINESS_HOURS.minLeadTime;
  const minDate = new Date(now.getTime() + minLeadTime * 60 * 60 * 1000);
  const maxDate = new Date(now.getTime() + BUSINESS_HOURS.maxAdvanceBooking * 24 * 60 * 60 * 1000);

  return date >= minDate && date <= maxDate;
};