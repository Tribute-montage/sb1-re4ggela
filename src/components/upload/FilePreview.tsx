import React from 'react';
import { Film, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FilePreviewProps {
  file: MediaFile;
  onRemove: () => void;
  onNotesChange: (notes: string) => void;
}

export function FilePreview({ file, onRemove, onNotesChange }: FilePreviewProps) {
  return (
    <div className="relative bg-white rounded-lg shadow-sm p-4">
      <div className="aspect-square mb-2">
        {file.type === 'image' ? (
          <img
            src={file.preview}
            alt={file.file.name}
            className="w-full h-full object-cover rounded-md"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-md">
            <Film className="h-8 w-8 text-gray-400" />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-900 truncate">
          {file.file.name}
        </p>
        
        <input
          type="text"
          value={file.notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Add notes..."
          className="w-full text-sm border rounded px-2 py-1"
        />

        <button
          onClick={onRemove}
          className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>
      </div>

      {file.status === 'uploading' && (
        <div className="absolute inset-x-4 bottom-4">
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${file.progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}