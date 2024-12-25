import { collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { FeedbackForm, SupportTicket, TicketMessage } from './types';
import { sendOrderStatusUpdate } from '../email/sendEmail';

export async function submitFeedback(feedback: FeedbackForm) {
  try {
    const feedbackRef = await addDoc(collection(db, 'feedback'), {
      ...feedback,
      createdAt: new Date(),
    });

    // If rating is low, automatically create a support ticket
    if (feedback.rating <= 2) {
      await createSupportTicket({
        clientId: feedback.clientId,
        orderId: feedback.orderId,
        subject: 'Low Rating Follow-up',
        message: `Automatic ticket created due to low rating (${feedback.rating}/5).\nClient comment: ${feedback.comment}`,
        priority: 'high',
      });
    }

    return feedbackRef.id;
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw error;
  }
}

export async function createSupportTicket(ticket: Omit<SupportTicket, 'id' | 'status' | 'createdAt' | 'updatedAt'>) {
  try {
    const ticketRef = await addDoc(collection(db, 'supportTickets'), {
      ...ticket,
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return ticketRef.id;
  } catch (error) {
    console.error('Error creating support ticket:', error);
    throw error;
  }
}

export async function addTicketMessage(message: Omit<TicketMessage, 'id' | 'createdAt'>) {
  try {
    const messageRef = await addDoc(collection(db, 'ticketMessages'), {
      ...message,
      createdAt: new Date(),
    });

    // Update ticket's updatedAt timestamp
    await updateDoc(doc(db, 'supportTickets', message.ticketId), {
      updatedAt: new Date(),
    });

    return messageRef.id;
  } catch (error) {
    console.error('Error adding ticket message:', error);
    throw error;
  }
}

export async function getClientTickets(clientId: string): Promise<SupportTicket[]> {
  try {
    const ticketsRef = collection(db, 'supportTickets');
    const q = query(ticketsRef, where('clientId', '==', clientId));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as SupportTicket));
  } catch (error) {
    console.error('Error fetching client tickets:', error);
    throw error;
  }
}

export async function getTicketMessages(ticketId: string): Promise<TicketMessage[]> {
  try {
    const messagesRef = collection(db, 'ticketMessages');
    const q = query(messagesRef, where('ticketId', '==', ticketId));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as TicketMessage));
  } catch (error) {
    console.error('Error fetching ticket messages:', error);
    throw error;
  }
}