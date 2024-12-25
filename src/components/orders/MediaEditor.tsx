import React from 'react';
import ReactCrop, { type Crop } from 'react-image-crop';
import ReactPlayer from 'react-player';
import 'react-image-crop/dist/ReactCrop.css';

interface MediaEditorProps {
  file: File;
  type: 'image' | 'video';
  onSave: (editedFile: File) => void;
  onCancel: () => void;
}

export function MediaEditor({ file, type, onSave, onCancel }: MediaEditorProps) {
  const [crop, setCrop] = React.useState<Crop>();
  const [videoTrim, setVideoTrim] = React.useState({ start: 0, end: 0 });
  const [duration, setDuration] = React.useState(0);
  const imageRef = React.useRef<HTMLImageElement>(null);
  const videoRef = React.useRef<ReactPlayer>(null);

  const handleImageCrop = async () => {
    if (!imageRef.current || !crop) return;

    const canvas = document.createElement('canvas');
    const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
    const scaleY = imageRef.current.naturalHeight / imageRef.current.height;

    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    ctx.drawImage(
      imageRef.current,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    canvas.toBlob((blob) => {
      if (blob) {
        const croppedFile = new File([blob], file.name, { type: file.type });
        onSave(croppedFile);
      }
    }, file.type);
  };

  const handleVideoTrim = async () => {
    // In a real implementation, we would use a video processing library
    // For now, we'll just simulate the trim by creating a new file
    const trimmedFile = new File([file], file.name, { type: file.type });
    onSave(trimmedFile);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4">
        <h3 className="text-lg font-medium mb-4">
          {type === 'image' ? 'Crop Image' : 'Trim Video'}
        </h3>

        <div className="aspect-video bg-gray-100 mb-4">
          {type === 'image' ? (
            <ReactCrop
              crop={crop}
              onChange={c => setCrop(c)}
              aspect={16 / 9}
            >
              <img
                ref={imageRef}
                src={URL.createObjectURL(file)}
                className="max-h-[60vh] mx-auto"
              />
            </ReactCrop>
          ) : (
            <div>
              <ReactPlayer
                ref={videoRef}
                url={URL.createObjectURL(file)}
                controls
                width="100%"
                height="100%"
                onDuration={setDuration}
              />
              <div className="mt-4">
                <input
                  type="range"
                  min={0}
                  max={duration}
                  value={videoTrim.start}
                  onChange={e => setVideoTrim(prev => ({ ...prev, start: Number(e.target.value) }))}
                  className="w-full"
                />
                <input
                  type="range"
                  min={0}
                  max={duration}
                  value={videoTrim.end}
                  onChange={e => setVideoTrim(prev => ({ ...prev, end: Number(e.target.value) }))}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={type === 'image' ? handleImageCrop : handleVideoTrim}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            {type === 'image' ? 'Apply Crop' : 'Apply Trim'}
          </button>
        </div>
      </div>
    </div>
  );
}