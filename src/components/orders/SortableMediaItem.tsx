import React from 'react';
import { Film, X, Edit2, Eye } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '../../lib/utils';

interface SortableMediaItemProps {
  file: MediaFile;
  onRemove: (id: string) => void;
  onNotesChange: (id: string, notes: string) => void;
  onView: () => void;
  onEdit: () => void;
}

export function SortableMediaItem({
  file,
  onRemove,
  onNotesChange,
  onView,
  onEdit,
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

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onRemove(file.id);
  };

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onView();
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onEdit();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative bg-white rounded-lg shadow-sm hover:shadow transition-shadow duration-200",
        "w-[160px]", // Fixed width for consistency
        isDragging && "shadow-lg scale-105 z-50"
      )}
      {...attributes}
    >
      {/* Order number badge */}
      <div className="absolute -top-2 -left-2 z-10 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-medium shadow-sm">
        {file.order + 1}
      </div>

      {/* Drag handle */}
      <div
        {...listeners}
        className="absolute -top-2 -right-2 z-10 w-6 h-6 bg-gray-600 text-white rounded-full flex items-center justify-center text-xs cursor-move hover:bg-gray-700"
      >
        ⋮⋮
      </div>

      <div className="relative aspect-square">
        {/* Preview container */}
        <div className="absolute inset-0 overflow-hidden rounded-t-lg bg-gray-50">
          {file.type === 'image' ? (
            <img
              src={file.preview}
              alt={file.file.name}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gray-100">
              <Film className="h-8 w-8 text-gray-400" />
            </div>
          )}
        </div>

        {/* Controls overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 rounded-t-lg">
          <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={handleView}
              className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors"
              title="View"
            >
              <Eye className="h-4 w-4 text-gray-600" />
            </button>
            <button
              onClick={handleEdit}
              className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors"
              title="Edit"
            >
              <Edit2 className="h-4 w-4 text-gray-600" />
            </button>
            <button
              onClick={handleRemove}
              className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors"
              title="Remove"
            >
              <X className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>

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