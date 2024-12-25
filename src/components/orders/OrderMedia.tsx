import React from 'react';
import { useOrderMedia } from '../../hooks/useOrderMedia';
import { Film, Image as ImageIcon, Trash2, Eye } from 'lucide-react';
import { cn } from '../../lib/utils';

interface OrderMediaProps {
  orderId: string;
}

export function OrderMedia({ orderId }: OrderMediaProps) {
  const { media, loading, deleteMedia } = useOrderMedia(orderId);
  const [selectedMedia, setSelectedMedia] = React.useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-24">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Media Files</h3>
      
      {media.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No media files uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {media.map((item) => (
            <div
              key={item.id}
              className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden"
            >
              {/* Preview */}
              {item.contentType.startsWith('image/') ? (
                <img
                  src={item.url}
                  alt={item.fileName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Film className="h-8 w-8 text-gray-400" />
                </div>
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => setSelectedMedia(item.url)}
                  className="p-2 bg-white rounded-full hover:bg-gray-100"
                  title="View"
                >
                  <Eye className="h-4 w-4 text-gray-600" />
                </button>
                <button
                  onClick={() => deleteMedia(item.id)}
                  className="p-2 bg-white rounded-full hover:bg-gray-100"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4 text-gray-600" />
                </button>
              </div>

              {/* File name */}
              <div className="absolute bottom-0 inset-x-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                {item.fileName}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Media viewer modal */}
      {selectedMedia && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedMedia(null)}
        >
          <div className="max-w-4xl w-full max-h-[90vh] relative">
            {selectedMedia.match(/\.(jpg|jpeg|png|gif)$/i) ? (
              <img
                src={selectedMedia}
                alt="Preview"
                className="max-w-full max-h-[90vh] object-contain mx-auto"
              />
            ) : (
              <video
                src={selectedMedia}
                controls
                className="max-w-full max-h-[90vh] mx-auto"
              >
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </div>
      )}
    </div>
  );
}