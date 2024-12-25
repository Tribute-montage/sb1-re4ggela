```typescript
import React from 'react';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { MediaReview } from '../../../hooks/admin/useMediaReview';

interface MediaReviewSummaryProps {
  review: MediaReview;
}

export function MediaReviewSummary({ review }: MediaReviewSummaryProps) {
  const stats = {
    total: review.items.length,
    approved: review.items.filter(i => i.status === 'approved').length,
    rejected: review.items.filter(i => i.status === 'rejected').length,
    pending: review.items.filter(i => i.status === 'pending').length,
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Review Progress</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-sm text-gray-500">Pending Review</span>
          </div>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {stats.pending}
          </p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <span className="text-sm text-gray-500">Approved</span>
          </div>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {stats.approved}
          </p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-sm text-gray-500">Rejected</span>
          </div>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {stats.rejected}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all duration-300"
            style={{ width: `${(stats.approved / stats.total) * 100}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-gray-500 text-center">
          {stats.approved} of {stats.total} items reviewed
        </p>
      </div>
    </div>
  );
}
```