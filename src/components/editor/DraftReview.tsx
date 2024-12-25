```typescript
import React from 'react';
import { useDraftReview } from '../../hooks/editor/useDraftReview';
import { DraftUploader } from './DraftUploader';
import { ClientFeedback } from './ClientFeedback';
import { DraftPreview } from './DraftPreview';
import { DraftStatus } from './DraftStatus';

interface DraftReviewProps {
  orderId: string;
}

export function DraftReview({ orderId }: DraftReviewProps) {
  const {
    draft,
    feedback,
    loading,
    uploadDraft,
    updateDraftStatus,
  } = useDraftReview(orderId);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-64 bg-gray-200 rounded-lg" />
        <div className="h-32 bg-gray-100 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <h2 className="text-lg font-medium text-gray-900">Draft Review</h2>
        <DraftStatus status={draft?.status} />
      </div>

      {!draft ? (
        <DraftUploader onUpload={uploadDraft} />
      ) : (
        <>
          <DraftPreview draft={draft} />
          <ClientFeedback feedback={feedback} />
        </>
      )}
    </div>
  );
}
```