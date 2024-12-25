import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Film, X, Edit2, Eye } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { MediaFile } from '../../../hooks/useMediaUpload';

interface SortableMediaItemProps {
  file: MediaFile;
  onRemove: (id: string) => void;
  onNotesChange: (id: string, notes: string) => void;
}

export function SortableMediaItem({
  file,
  onRemove,
  onNotesChange,
}: SortableMediaItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: file.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative bg-white rounded-lg shadow-sm",
        "transition-all duration-200",
        isDragging && "shadow-lg scale-105 z-50"
      )}
    >
      {/* Order number badge */}
      <div className="absolute -top-2 -left-2 z-10 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-medium shadow-sm">
        {file.order + 1}
      </div>

      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute -top-2 -right-2 z-10 w-6 h-6 bg-gray-600 text-white rounded-full flex items-center justify-center text-xs cursor-move hover:bg-gray-700"
      >
        ⋮⋮
      </div>

      {/* Preview */}
      <div className="aspect-square">
        {file.type === 'image' ? (
          <img
            src={file.preview}
            alt={file.file.name}
            className="w-full h-full object-cover rounded-t-lg"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-t-lg">
            <Film className="h-8 w-8 text-gray-400" />
          </div>
        )}

        {/* Upload progress */}
        {file.status === 'uploading' && (
          <div className="absolute inset-x-0 bottom-0 bg-black/50 px-2 py-1">
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-white h-full rounded-full transition-all duration-300"
                style={{ width: `${file.progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* File info */}
      <div className="p-2">
        <p className="text-xs text-gray-600 truncate" title={file.file.name}>
          {file.file.name}
        </p>
        <input
          type="text"
          value={file.notes}
          onChange={(e) => onNotesChange(file.id, e.target.value)}
          placeholder="Add notes..."
          className="mt-1 w-full text-xs border rounded px-1.5 py-1 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Remove button */}
      <button
        onClick={() => onRemove(file.id)}
        className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="h-4 w-4 text-gray-600" />
      </button>

      {/* Status indicator */}
      <div className="absolute bottom-0 right-0 p-1">
        {file.status === 'completed' && (
          <div className="w-2 h-2 bg-green-500 rounded-full" title="Upload complete" />
        )}
        {file.status === 'error' && (
          <div className="w-2 h-2 bg-red-500 rounded-full" title="Upload failed" />
        )}
      </div>
    </div>
  );
}