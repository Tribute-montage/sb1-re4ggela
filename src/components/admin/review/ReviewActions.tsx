```typescript
import React from 'react';
import { CheckCircle, XCircle, UploadCloud } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { MediaItem } from '../../../hooks/admin/useMediaReview';

interface ReviewActionsProps {
  item: MediaItem;
  onApprove: (id: string, notes?: string) => void;
  onReject: (id: string, reason: string) => void;
  onReupload: (id: string, notes: string) => void;
}

export function ReviewActions({
  item,
  onApprove,
  onReject,
  onReupload,
}: ReviewActionsProps) {
  const [notes, setNotes] = React.useState('');
  const [showNotes, setShowNotes] = React.useState(false);

  const handleAction = (action: 'approve' | 'reject' | 'reupload') => {
    switch (action) {
      case 'approve':
        onApprove(item.id, notes);
        break;
      case 'reject':
        onReject(item.id, notes);
        break;
      case 'reupload':
        onReupload(item.id, notes);
        break;
    }
    setNotes('');
    setShowNotes(false);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setShowNotes(true)}
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
          onClick={() => setShowNotes(true)}
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
          onClick={() => setShowNotes(true)}
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

      {showNotes && (
        <div className="space-y-3">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes or feedback..."
            className={cn(
              "block w-full rounded-md border-gray-300 shadow-sm",
              "focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            )}
            rows={3}
          />
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowNotes(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => handleAction('approve')}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```