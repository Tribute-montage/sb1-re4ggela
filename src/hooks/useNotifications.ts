import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase/client';
import { useAuthStore } from '../store/useAuthStore';
import { toast } from 'sonner';

interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'order_update' | 'system' | 'review_request';
  read: boolean;
  createdAt: string;
  metadata?: Record<string, any>;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;

    let subscription: any;

    async function fetchNotifications() {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) throw error;
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    }

    // Set up real-time subscription
    subscription = supabase
      .channel(`notifications:${user.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const notification = payload.new as Notification;
          setNotifications(prev => [notification, ...prev]);
          
          // Show toast for new notifications
          toast(notification.title, {
            description: notification.message,
          });
        }
      })
      .subscribe();

    fetchNotifications();

    return () => {
      subscription?.unsubscribe();
    };
  }, [user]);

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return {
    notifications,
    markAsRead,
  };
}