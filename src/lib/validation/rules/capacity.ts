import { supabase } from '../../supabase/client';

// Maximum orders per time slot
const MAX_ORDERS_PER_SLOT = 3;
const SLOT_DURATION = 60; // minutes

export const isTimeSlotAvailable = async (
  deliveryDate: Date,
  isRush = false
): Promise<boolean> => {
  // Round to nearest hour
  const slotStart = new Date(deliveryDate);
  slotStart.setMinutes(0, 0, 0);
  
  const slotEnd = new Date(slotStart);
  slotEnd.setMinutes(slotEnd.getMinutes() + SLOT_DURATION);

  // Check existing orders in this time slot
  const { data: existingOrders, error } = await supabase
    .from('orders')
    .select('count')
    .gte('requested_delivery_date', slotStart.toISOString())
    .lt('requested_delivery_date', slotEnd.toISOString());

  if (error) throw error;

  const orderCount = existingOrders.length;
  const maxOrders = isRush ? Math.floor(MAX_ORDERS_PER_SLOT / 2) : MAX_ORDERS_PER_SLOT;

  return orderCount < maxOrders;
};

export const getDailyCapacity = async (date: Date): Promise<{
  total: number;
  booked: number;
  available: number;
}> => {
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  const { data: orders, error } = await supabase
    .from('orders')
    .select('requested_delivery_date, is_rush')
    .gte('requested_delivery_date', dayStart.toISOString())
    .lt('requested_delivery_date', dayEnd.toISOString());

  if (error) throw error;

  const totalSlots = 8 * MAX_ORDERS_PER_SLOT; // 8 hours per day
  const bookedSlots = orders.reduce((acc, order) => 
    acc + (order.is_rush ? 2 : 1), 0);

  return {
    total: totalSlots,
    booked: bookedSlots,
    available: totalSlots - bookedSlots
  };
};