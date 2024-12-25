```typescript
import React from 'react';
import { MessageCircle, ThumbsUp, ThumbsDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { DraftFeedback } from '../../hooks/editor/useDraftReview';

interface ClientFeedbackProps {
  feedback: DraftFeedback[];
}

export function ClientFeedback({ feedback }: ClientFeedbackProps) {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Client Feedback</h3>
      </div>

      <div className="divide-y divide-gray-200">
        {feedback.length === 0 ? (
          <p className="p-4 text-sm text-gray-500 text-center">
            No feedback received yet
          </p>
        ) : (
          feedback.map((item) => (
            <div key={item.id} className="p-4">
              <div className="flex items-start space-x-3">
                <div className={cn(
                  "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                  item.type === 'approval' ? 'bg-green-100' : 'bg-yellow-100'
                )}>
                  {item.type === 'approval' ? (
                    <ThumbsUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <ThumbsDown className="h-4 w-4 text-yellow-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {item.type === 'approval' ? 'Approved' : 'Changes Requested'}
                  </p>
                  {item.comment && (
                    <p className="mt-1 text-sm text-gray-500">{item.comment}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-400">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
```