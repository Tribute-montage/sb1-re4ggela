import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Order } from '../../types/order';
import { sendOrderStatusUpdate, sendReviewReminder } from './sendEmail';

// Set up real-time listeners for order status changes
export function setupOrderStatusListeners(orderId: string, userEmail: string, userName: string) {
  const unsubscribe = onSnapshot(doc(db, 'orders', orderId), async (snapshot) => {
    const order = snapshot.data() as Order;
    
    if (!order) return;

    // Get the previous status from local storage
    const prevStatus = localStorage.getItem(`order_${orderId}_status`);
    
    // If status has changed, send notification
    if (prevStatus && prevStatus !== order.status) {
      try {
        await sendOrderStatusUpdate(
          userEmail,
          order,
          userName,
          order.status
        );
      } catch (error) {
        console.error('Failed to send status update email:', error);
      }
    }
    
    // Update stored status
    localStorage.setItem(`order_${orderId}_status`, order.status);
  });

  return unsubscribe;
}

// Set up review reminder system
export function setupReviewReminders(orderId: string, userEmail: string, userName: string) {
  const REMINDER_INTERVALS = [2, 5, 7]; // Days to wait before sending reminders
  let timeoutIds: NodeJS.Timeout[] = [];

  const unsubscribe = onSnapshot(doc(db, 'orders', orderId), (snapshot) => {
    const order = snapshot.data() as Order;
    
    // Clear existing timeouts
    timeoutIds.forEach(clearTimeout);
    timeoutIds = [];

    if (order?.status === 'review') {
      const reviewStartDate = new Date(order.updatedAt);
      
      // Set up reminders
      REMINDER_INTERVALS.forEach(days => {
        const reminderDate = new Date(reviewStartDate);
        reminderDate.setDate(reminderDate.getDate() + days);
        
        const now = new Date();
        const delay = reminderDate.getTime() - now.getTime();
        
        if (delay > 0) {
          const timeoutId = setTimeout(async () => {
            // Check if order is still in review status before sending reminder
            const currentDoc = await doc(db, 'orders', orderId).get();
            const currentOrder = currentDoc.data() as Order;
            
            if (currentOrder?.status === 'review') {
              try {
                await sendReviewReminder(
                  userEmail,
                  order,
                  userName,
                  days
                );
              } catch (error) {
                console.error('Failed to send review reminder:', error);
              }
            }
          }, delay);
          
          timeoutIds.push(timeoutId);
        }
      });
    }
  });

  return () => {
    unsubscribe();
    timeoutIds.forEach(clearTimeout);
  };
}