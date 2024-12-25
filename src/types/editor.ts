export interface EditorOrder {
  id: string;
  orderNumber: string;
  status: 'pending' | 'in-progress' | 'review' | 'completed';
  clientName: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface EditorStats {
  activeOrders: number;
  completedOrders: number;
  averageCompletionTime: number;
  pendingReviews: number;
}

export interface DraftFeedback {
  id: string;
  draftId: string;
  type: 'approval' | 'change_request';
  comment?: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    role: string;
  };
}

export interface Draft {
  id: string;
  orderId: string;
  version: number;
  url: string;
  status: 'pending_review' | 'approved' | 'changes_requested';
  createdAt: string;
}

export interface TimelineEvent {
  id: string;
  type: 'status_change' | 'comment' | 'review' | 'assignment';
  title: string;
  description: string;
  timestamp: string;
  user: {
    id: string;
    name: string;
    role: string;
  };
}