import React from 'react';
import { MessageCircle, ThumbsUp, ThumbsDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Feedback } from '../../types/editor';

interface ReviewFeedbackProps {
  feedback: Feedback[];
}

export function ReviewFeedback({ feedback }: ReviewFeedbackProps) {
  if (feedback.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Feedback</h3>
        <p className="text-gray-500 text-center">No feedback yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Feedback</h3>
      <div className="space-y-4">
        {feedback.map((item) => (
          <div
            key={item.id}
            className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg"
          >
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
              <div className="mt-2 flex items-center text-xs text-gray-500">
                <span>{item.user.name}</span>
                <span className="mx-2">•</span>
                <time dateTime={item.createdAt}>
                  {new Date(item.createdAt).toLocaleString()}
                </time>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}