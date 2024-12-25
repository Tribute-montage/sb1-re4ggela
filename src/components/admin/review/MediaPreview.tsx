```typescript
import React from 'react';
import { Film } from 'lucide-react';
import type { MediaItem } from '../../../hooks/admin/useMediaReview';

interface MediaPreviewProps {
  item: MediaItem;
}

export function MediaPreview({ item }: MediaPreviewProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="aspect-video bg-gray-900 relative">
        {item.type === 'image' ? (
          <img
            src={item.url}
            alt={item.fileName}
            className="w-full h-full object-contain"
          />
        ) : item.type === 'video' ? (
          <video
            src={item.url}
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
        <h4 className="text-lg font-medium text-gray-900">{item.fileName}</h4>
        <p className="mt-1 text-sm text-gray-500">
          Uploaded {new Date(item.uploadedAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
```