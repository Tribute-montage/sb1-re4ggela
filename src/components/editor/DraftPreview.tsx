```typescript
import React from 'react';
import { Film } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Draft } from '../../hooks/editor/useDraftReview';

interface DraftPreviewProps {
  draft: Draft;
}

export function DraftPreview({ draft }: DraftPreviewProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="aspect-video bg-gray-900 relative">
        {draft.url ? (
          <video
            src={draft.url}
            controls
            className="w-full h-full"
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Film className="h-12 w-12 text-gray-400" />
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-lg font-medium text-gray-900">Draft Version {draft.version}</h4>
            <p className="mt-1 text-sm text-gray-500">
              Uploaded {new Date(draft.createdAt).toLocaleString()}
            </p>
          </div>
          <div className={cn(
            "px-2.5 py-0.5 rounded-full text-xs font-medium",
            draft.status === 'pending_review' && "bg-yellow-100 text-yellow-800",
            draft.status === 'approved' && "bg-green-100 text-green-800",
            draft.status === 'changes_requested' && "bg-red-100 text-red-800"
          )}>
            {draft.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </div>
        </div>
      </div>
    </div>
  );
}
```