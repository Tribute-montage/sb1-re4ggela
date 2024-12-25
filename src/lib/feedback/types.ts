export interface FeedbackForm {
  rating: number;
  comment: string;
  orderId: string;
  clientId: string;
}

export interface SupportTicket {
  id: string;
  clientId: string;
  orderId?: string;
  subject: string;
  message: string;
  status: 'open' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  senderId: string;
  message: string;
  createdAt: Date;
  isStaff: boolean;
}