import React from 'react';
import { X } from 'lucide-react';
import ReactPlayer from 'react-player';

interface MediaViewerProps {
  file: MediaFile;
  onClose: () => void;
}

export function MediaViewer({ file, onClose }: MediaViewerProps) {
  const [isLoading, setIsLoading] = React.useState(true);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/95" onClick={handleBackdropClick}>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-white/70 hover:text-white z-10 rounded-full bg-black/20 hover:bg-black/40"
      >
        <X className="h-6 w-6" />
      </button>

      <div className="h-full flex flex-col items-center justify-center p-4">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        )}

        <div className="w-full max-w-5xl flex-1 flex flex-col">
          <div className="flex-1 flex items-center justify-center">
            {file.type === 'image' ? (
              <img
                src={file.preview}
                alt={file.file.name}
                className="max-h-[85vh] max-w-full object-contain select-none"
                onLoad={() => setIsLoading(false)}
                draggable={false}
              />
            ) : (
              <ReactPlayer
                url={file.preview}
                controls
                width="100%"
                height="100%"
                className="max-h-[85vh]"
                onReady={() => setIsLoading(false)}
                config={{
                  file: {
                    attributes: {
                      controlsList: 'nodownload',
                    },
                  },
                }}
              />
            )}
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-white/70">{file.file.name}</p>
            {file.notes && (
              <p className="mt-2 text-sm text-white/50 italic">
                Notes: {file.notes}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}