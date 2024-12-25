import React from 'react';
import { AssignedOrders } from '../AssignedOrders';
import { DraftQueue } from '../DraftQueue';
import { ReviewFeedback } from '../ReviewFeedback';
import ProjectTimeline from '../../collaboration/ProjectTimeline';
import { ProjectStatus } from '../../collaboration/ProjectStatus';
import type { TimelineEvent } from '../../../types/editor';

interface DashboardContentProps {
  orders: any[];
  drafts: any[];
  feedback: any[];
  timeline: TimelineEvent[];
}

export function DashboardContent({ orders, drafts, feedback, timeline }: DashboardContentProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <AssignedOrders orders={orders} />
        <ProjectTimeline events={timeline} />
      </div>
      <div className="space-y-6">
        <DraftQueue drafts={drafts} />
        <ReviewFeedback feedback={feedback} />
        {orders[0] && (
          <ProjectStatus
            status={orders[0].status}
            progress={75}
            dueDate={orders[0].requestedDeliveryDate}
            assignedTo={{
              name: "Current Editor",
              role: "editor"
            }}
          />
        )}
      </div>
    </div>
  );
}