import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Film, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface DraftQueueProps {
  drafts: Array<{
    id: string;
    orderId: string;
    version: number;
    status: string;
    createdAt: string;
  }>;
}

export function DraftQueue({ drafts }: DraftQueueProps) {
  const navigate = useNavigate();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending_review':
        return Clock;
      case 'approved':
        return CheckCircle;
      case 'changes_requested':
        return AlertCircle;
      default:
        return Film;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_review':
        return 'text-yellow-500';
      case 'approved':
        return 'text-green-500';
      case 'changes_requested':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Draft Queue
        </h3>

        <div className="space-y-4">
          {drafts.map((draft) => {
            const StatusIcon = getStatusIcon(draft.status);
            const statusColor = getStatusColor(draft.status);

            return (
              <button
                key={draft.id}
                onClick={() => {
                  navigate(`/editor/drafts/${draft.id}`);
                }}
                className={cn(
                  "w-full flex items-center p-4 rounded-lg",
                  "bg-gray-50 hover:bg-gray-100 transition-colors",
                  "text-left focus:outline-none focus:ring-2",
                  "focus:ring-indigo-500 focus:ring-offset-2"
                )}
              >
                <StatusIcon className={cn("h-5 w-5 mr-3", statusColor)} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Version {draft.version}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(draft.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className={cn(
                  "px-2.5 py-0.5 rounded-full text-xs font-medium",
                  draft.status === 'pending_review' && "bg-yellow-100 text-yellow-800",
                  draft.status === 'approved' && "bg-green-100 text-green-800",
                  draft.status === 'changes_requested' && "bg-red-100 text-red-800"
                )}>
                  {draft.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </div>
              </button>
            );
          })}

          {drafts.length === 0 && (
            <p className="text-center py-4 text-gray-500">
              No drafts in queue
            </p>
          )}
        </div>
      </div>
    </div>
  );
}