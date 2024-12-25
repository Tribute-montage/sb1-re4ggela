```typescript
import React from 'react';
import { CheckCircle, XCircle, UploadCloud } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { MediaReviewItem } from '../../../hooks/admin/useMediaReview';

interface MediaFeedbackProps {
  item: MediaReviewItem;
  onUpdateStatus: (id: string, status: MediaReviewItem['status'], feedback?: string) => void;
}

export function MediaFeedback({ item, onUpdateStatus }: MediaFeedbackProps) {
  const [feedback, setFeedback] = React.useState(item.feedback || '');
  const [showFeedback, setShowFeedback] = React.useState(false);

  const handleAction = (status: MediaReviewItem['status']) => {
    onUpdateStatus(item.id, status, feedback);
    setFeedback('');
    setShowFeedback(false);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      {/* Status Badge */}
      {item.status !== 'pending' && (
        <div className={cn(
          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
          item.status === 'approved' && "bg-green-100 text-green-800",
          item.status === 'rejected' && "bg-red-100 text-red-800",
          item.status === 'reupload_requested' && "bg-yellow-100 text-yellow-800"
        )}>
          {item.status === 'approved' && 'Approved'}
          {item.status === 'rejected' && 'Rejected'}
          {item.status === 'reupload_requested' && 'Reupload Requested'}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setShowFeedback(true)}
          className={cn(
            "inline-flex items-center px-4 py-2 rounded-md text-sm font-medium",
            "bg-green-600 text-white hover:bg-green-700",
            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          )}
        >
          <CheckCircle className="h-5 w-5 mr-2" />
          Approve
        </button>

        <button
          onClick={() => setShowFeedback(true)}
          className={cn(
            "inline-flex items-center px-4 py-2 rounded-md text-sm font-medium",
            "bg-red-600 text-white hover:bg-red-700",
            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          )}
        >
          <XCircle className="h-5 w-5 mr-2" />
          Reject
        </button>

        <button
          onClick={() => setShowFeedback(true)}
          className={cn(
            "inline-flex items-center px-4 py-2 rounded-md text-sm font-medium",
            "bg-yellow-600 text-white hover:bg-yellow-700",
            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          )}
        >
          <UploadCloud className="h-5 w-5 mr-2" />
          Request Reupload
        </button>
      </div>

      {/* Feedback Form */}
      {showFeedback && (
        <div className="space-y-3">
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Add feedback or notes..."
            className={cn(
              "block w-full rounded-md border-gray-300 shadow-sm",
              "focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            )}
            rows={3}
          />
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowFeedback(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => handleAction('approved')}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {/* Previous Feedback */}
      {item.feedback && !showFeedback && (
        <div className="mt-2 text-sm text-gray-500">
          <p className="font-medium">Previous Feedback:</p>
          <p className="mt-1">{item.feedback}</p>
        </div>
      )}
    </div>
  );
}
```