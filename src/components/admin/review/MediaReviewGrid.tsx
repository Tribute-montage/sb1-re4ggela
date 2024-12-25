import React from 'react';
import { MediaReviewItem } from '../../../hooks/admin/useMediaReview';
import { MediaPreview } from './MediaPreview';
import { MediaFeedback } from './MediaFeedback';
import { cn } from '../../../lib/utils';

interface MediaReviewGridProps {
  items: MediaReviewItem[];
  onUpdateStatus: (id: string, status: MediaReviewItem['status'], feedback?: string) => void;
}

export function MediaReviewGrid({ items, onUpdateStatus }: MediaReviewGridProps) {
  const [selectedItem, setSelectedItem] = React.useState<MediaReviewItem | null>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Media List */}
      <div className="lg:col-span-1 bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Media Files</h3>
        </div>
        <div className="p-4">
          <div className="space-y-2">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={cn(
                  "w-full flex items-center p-2 rounded-lg text-left",
                  selectedItem?.id === item.id
                    ? "bg-indigo-50 text-indigo-700"
                    : "hover:bg-gray-50"
                )}
              >
                <div className="w-12 h-12 bg-gray-200 rounded overflow-hidden mr-3">
                  {item.media.thumbnail && (
                    <img
                      src={item.media.thumbnail}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {item.media.fileName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.status === 'approved' && '✓ Approved'}
                    {item.status === 'rejected' && '✗ Rejected'}
                    {item.status === 'pending' && '• Pending Review'}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Preview and Feedback */}
      <div className="lg:col-span-2 space-y-6">
        {selectedItem ? (
          <>
            <MediaPreview item={selectedItem} />
            <MediaFeedback
              item={selectedItem}
              onUpdateStatus={onUpdateStatus}
            />
          </>
        ) : (
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
            Select a media file to review
          </div>
        )}
      </div>
    </div>
  );
}