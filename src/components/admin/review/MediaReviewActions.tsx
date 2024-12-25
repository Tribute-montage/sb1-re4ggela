```typescript
import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { MediaReview } from '../../../hooks/admin/useMediaReview';

interface MediaReviewActionsProps {
  review: MediaReview;
  onComplete: (status: MediaReview['status'], notes?: string) => Promise<void>;
}

export function MediaReviewActions({ review, onComplete }: MediaReviewActionsProps) {
  const [notes, setNotes] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

  const handleComplete = async (status: MediaReview['status']) => {
    setSubmitting(true);
    try {
      await onComplete(status, notes);
    } finally {
      setSubmitting(false);
    }
  };

  const canComplete = review.items.every(item => item.status !== 'pending');

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Complete Review</h3>

      <div className="space-y-4">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any final notes or feedback..."
          className={cn(
            "block w-full rounded-md border-gray-300 shadow-sm",
            "focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          )}
          rows={4}
        />

        <div className="flex flex-col space-y-3">
          <button
            onClick={() => handleComplete('approved')}
            disabled={!canComplete || submitting}
            className={cn(
              "inline-flex items-center justify-center px-4 py-2",
              "border border-transparent rounded-md shadow-sm",
              "text-sm font-medium text-white bg-green-600",
              "hover:bg-green-700 focus:outline-none focus:ring-2",
              "focus:ring-offset-2 focus:ring-green-500",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            Approve All Media
          </button>

          <button
            onClick={() => handleComplete('rejected')}
            disabled={!canComplete || submitting}
            className={cn(
              "inline-flex items-center justify-center px-4 py-2",
              "border border-transparent rounded-md shadow-sm",
              "text-sm font-medium text-white bg-red-600",
              "hover:bg-red-700 focus:outline-none focus:ring-2",
              "focus:ring-offset-2 focus:ring-red-500",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <XCircle className="h-5 w-5 mr-2" />
            Reject All Media
          </button>

          <button
            onClick={() => handleComplete('reupload_requested')}
            disabled={!canComplete || submitting}
            className={cn(
              "inline-flex items-center justify-center px-4 py-2",
              "border border-transparent rounded-md shadow-sm",
              "text-sm font-medium text-white bg-yellow-600",
              "hover:bg-yellow-700 focus:outline-none focus:ring-2",
              "focus:ring-offset-2 focus:ring-yellow-500",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <AlertCircle className="h-5 w-5 mr-2" />
            Request Reupload
          </button>
        </div>

        {!canComplete && (
          <p className="text-sm text-yellow-600">
            Please review all media items before completing the review.
          </p>
        )}
      </div>
    </div>
  );
}
```