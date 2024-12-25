```tsx
import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface MediaFeedbackProps {
  feedback: string;
  onFeedbackChange: (value: string) => void;
  onApprove: () => void;
  onRequestChanges: () => void;
}

export function MediaFeedback({
  feedback,
  onFeedbackChange,
  onApprove,
  onRequestChanges,
}: MediaFeedbackProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Review & Feedback</h3>
      
      <div className="space-y-4">
        <textarea
          value={feedback}
          onChange={(e) => onFeedbackChange(e.target.value)}
          placeholder="Enter your feedback or change requests here..."
          rows={6}
          className={cn(
            "block w-full rounded-md border-gray-300 shadow-sm",
            "focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          )}
        />

        <div className="flex flex-col space-y-3">
          <button
            onClick={onApprove}
            className={cn(
              "inline-flex items-center justify-center px-4 py-2",
              "border border-transparent rounded-md shadow-sm",
              "text-sm font-medium text-white bg-green-600",
              "hover:bg-green-700 focus:outline-none focus:ring-2",
              "focus:ring-offset-2 focus:ring-green-500"
            )}
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            Approve Media
          </button>

          <button
            onClick={onRequestChanges}
            disabled={!feedback.trim()}
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
            Request Changes
          </button>
        </div>
      </div>
    </div>
  );
}
```