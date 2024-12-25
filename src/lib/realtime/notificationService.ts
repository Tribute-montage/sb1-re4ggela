import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';

interface NotificationPayload {
  type: 'order_update' | 'feedback_received' | 'support_message';
  title: string;
  message: string;
  data?: Record<string, any>;
}

export class NotificationService {
  private socket: Socket;
  private static instance: NotificationService;

  private constructor() {
    this.socket = io(import.meta.env.VITE_SOCKET_URL);
    this.setupListeners();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private setupListeners() {
    this.socket.on('notification', (payload: NotificationPayload) => {
      this.handleNotification(payload);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }

  private handleNotification(payload: NotificationPayload) {
    toast(payload.title, {
      description: payload.message,
      action: {
        label: 'View',
        onClick: () => this.handleNotificationClick(payload),
      },
    });
  }

  private handleNotificationClick(payload: NotificationPayload) {
    switch (payload.type) {
      case 'order_update':
        if (payload.data?.orderId) {
          window.location.href = `/orders/${payload.data.orderId}`;
        }
        break;
      case 'feedback_received':
        if (payload.data?.feedbackId) {
          window.location.href = `/feedback/${payload.data.feedbackId}`;
        }
        break;
      case 'support_message':
        if (payload.data?.ticketId) {
          window.location.href = `/support/tickets/${payload.data.ticketId}`;
        }
        break;
    }
  }

  connect(userId: string, role: string) {
    this.socket.emit('authenticate', { userId, role });
  }

  disconnect() {
    this.socket.disconnect();
  }
}

export const notificationService = NotificationService.getInstance();