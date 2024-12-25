import React from 'react';
import { X, Volume2, VolumeX } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface AssetPreviewProps {
  url: string;
  type: 'music' | 'cover' | 'scenery' | 'verse';
  onClose: () => void;
}

export function AssetPreview({ url, type, onClose }: AssetPreviewProps) {
  const [isMuted, setIsMuted] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(!isMuted);
    }
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative max-w-4xl w-full max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 p-2 text-white/70 hover:text-white"
        >
          <X className="h-6 w-6" />
        </button>

        {type === 'music' ? (
          <div className="bg-gray-900 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-full">
                <audio
                  ref={audioRef}
                  src={url}
                  controls
                  className="w-full"
                  autoPlay
                />
              </div>
              <button
                onClick={toggleMute}
                className="ml-4 p-2 text-white/70 hover:text-white"
              >
                {isMuted ? (
                  <VolumeX className="h-6 w-6" />
                ) : (
                  <Volume2 className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        ) : type === 'scenery' ? (
          <div className="relative">
            <video
              ref={videoRef}
              src={url}
              controls
              className="max-h-[80vh] mx-auto rounded-lg"
              autoPlay
              loop
            />
            <button
              onClick={toggleMute}
              className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white/70 hover:text-white"
            >
              {isMuted ? (
                <VolumeX className="h-6 w-6" />
              ) : (
                <Volume2 className="h-6 w-6" />
              )}
            </button>
          </div>
        ) : (
          <img
            src={url}
            alt="Preview"
            className="max-h-[80vh] mx-auto rounded-lg"
          />
        )}
      </div>
    </div>
  );
}