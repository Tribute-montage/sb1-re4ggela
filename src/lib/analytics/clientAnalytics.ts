import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { ClientAnalytics } from './types';

export async function getClientAnalytics(): Promise<ClientAnalytics> {
  const usersRef = collection(db, 'users');
  const ordersRef = collection(db, 'orders');
  
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [usersSnapshot, ordersSnapshot] = await Promise.all([
    getDocs(query(usersRef, where('role', '==', 'client'))),
    getDocs(ordersRef)
  ]);

  const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  const orders = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  const newClients = users.filter(user => 
    new Date(user.createdAt) >= monthStart
  ).length;

  const activeClients = new Set(
    orders
      .filter(order => new Date(order.createdAt) >= lastMonth)
      .map(order => order.clientId)
  ).size;

  const retentionRate = calculateRetentionRate(users, orders);

  return {
    totalClients: users.length,
    activeClients,
    newClientsThisMonth: newClients,
    clientRetentionRate: retentionRate,
  };
}

function calculateRetentionRate(users: any[], orders: any[]): number {
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  
  const previousClients = new Set(
    orders
      .filter(order => new Date(order.createdAt) < lastMonth)
      .map(order => order.clientId)
  );

  const returningClients = new Set(
    orders
      .filter(order => new Date(order.createdAt) >= lastMonth)
      .map(order => order.clientId)
  );

  const retained = [...previousClients].filter(id => returningClients.has(id)).length;
  
  return previousClients.size ? (retained / previousClients.size) * 100 : 0;
}