```tsx
import React from 'react';
import { useOrderMedia } from '../../../hooks/useOrderMedia';
import { MediaViewer } from '../MediaViewer';
import { MediaFeedback } from './MediaFeedback';
import { cn } from '../../../lib/utils';

interface MediaReviewProps {
  orderId: string;
  onApprove: () => void;
  onRequestChanges: (feedback: string) => void;
}

export function MediaReview({ orderId, onApprove, onRequestChanges }: MediaReviewProps) {
  const { media, loading } = useOrderMedia(orderId);
  const [selectedMedia, setSelectedMedia] = React.useState<string | null>(null);
  const [feedback, setFeedback] = React.useState<string>('');

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Media Grid */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Media Files</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {media.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedMedia(item.url)}
                className={cn(
                  "aspect-square rounded-lg overflow-hidden cursor-pointer",
                  "border-2 hover:border-indigo-500 transition-colors"
                )}
              >
                {item.contentType.startsWith('image/') ? (
                  <img
                    src={item.url}
                    alt={item.fileName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={item.url}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Feedback Form */}
        <MediaFeedback
          feedback={feedback}
          onFeedbackChange={setFeedback}
          onApprove={onApprove}
          onRequestChanges={() => onRequestChanges(feedback)}
        />
      </div>

      {/* Media Viewer Modal */}
      {selectedMedia && (
        <MediaViewer
          url={selectedMedia}
          onClose={() => setSelectedMedia(null)}
        />
      )}
    </div>
  );
}
```