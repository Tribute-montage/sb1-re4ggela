import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Order } from '../../types/order';

export interface SearchFilters {
  status?: Order['status'];
  dateRange?: {
    start: Date;
    end: Date;
  };
  clientId?: string;
  videoType?: string;
}

export async function searchOrders(
  searchTerm: string,
  filters: SearchFilters = {}
): Promise<Order[]> {
  try {
    const ordersRef = collection(db, 'orders');
    let q = query(ordersRef);

    // Apply filters
    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    }
    
    if (filters.clientId) {
      q = query(q, where('clientId', '==', filters.clientId));
    }
    
    if (filters.videoType) {
      q = query(q, where('videoType', '==', filters.videoType));
    }
    
    if (filters.dateRange) {
      q = query(
        q,
        where('createdAt', '>=', filters.dateRange.start),
        where('createdAt', '<=', filters.dateRange.end)
      );
    }

    // Add default sorting
    q = query(q, orderBy('createdAt', 'desc'));

    const snapshot = await getDocs(q);
    const orders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Order));

    // Apply text search (client-side since Firestore doesn't support full-text search)
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return orders.filter(order =>
        order.title.toLowerCase().includes(searchLower) ||
        order.description.toLowerCase().includes(searchLower) ||
        order.id.toLowerCase().includes(searchLower)
      );
    }

    return orders;
  } catch (error) {
    console.error('Error searching orders:', error);
    throw error;
  }
}

export async function getRecentSearches(userId: string): Promise<string[]> {
  try {
    const searchesRef = collection(db, 'userSearches');
    const q = query(
      searchesRef,
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data().term);
  } catch (error) {
    console.error('Error fetching recent searches:', error);
    throw error;
  }
}