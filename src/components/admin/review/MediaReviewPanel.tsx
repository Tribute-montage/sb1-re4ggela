import React from 'react';
import { useMediaReview } from '../../../hooks/admin/useMediaReview';
import { MediaReviewGrid } from './MediaReviewGrid';
import { MediaReviewActions } from './MediaReviewActions';
import { MediaReviewSummary } from './MediaReviewSummary';
import { cn } from '../../../lib/utils';

interface MediaReviewPanelProps {
  orderId: string;
}

export function MediaReviewPanel({ orderId }: MediaReviewPanelProps) {
  const {
    review,
    loading,
    startReview,
    updateItemStatus,
    completeReview
  } = useMediaReview(orderId);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-64 bg-gray-200 rounded-lg" />
        <div className="h-32 bg-gray-100 rounded-lg" />
      </div>
    );
  }

  if (!review) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          No Active Review
        </h3>
        <button
          onClick={startReview}
          className={cn(
            "inline-flex items-center px-4 py-2 border border-transparent",
            "rounded-md shadow-sm text-sm font-medium text-white",
            "bg-indigo-600 hover:bg-indigo-700"
          )}
        >
          Start Review
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <MediaReviewSummary review={review} />
      <MediaReviewGrid
        items={review.items}
        onUpdateStatus={updateItemStatus}
      />
      <MediaReviewActions
        review={review}
        onComplete={completeReview}
      />
    </div>
  );
}