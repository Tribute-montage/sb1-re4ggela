import { sendEmail } from '../sendgrid/client';
import { Order } from '../../types/order';

export async function sendOrderConfirmation(
  to: string,
  order: Order,
  clientName: string
) {
  await sendEmail({
    to,
    subject: 'Your Tribute Montage Order Confirmation',
    html: `
      <h1>Order Confirmation</h1>
      <p>Dear ${clientName},</p>
      <p>Thank you for your order (#${order.id}). We'll begin working on your tribute montage shortly.</p>
      <p>You can track your order status in your dashboard.</p>
    `,
  });
}

export async function sendOrderStatusUpdate(
  to: string,
  order: Order,
  status: string
) {
  await sendEmail({
    to,
    subject: 'Your Tribute Montage Order Status Update',
    html: `
      <h1>Order Status Update</h1>
      <p>Your order (#${order.id}) status has been updated to: ${status}</p>
      <p>You can view the details in your dashboard.</p>
    `,
  });
}