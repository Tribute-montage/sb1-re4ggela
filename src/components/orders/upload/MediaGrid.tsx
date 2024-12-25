import React from 'react';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { SortableMediaItem } from './SortableMediaItem';
import { cn } from '../../../lib/utils';
import type { MediaFile } from '../../../hooks/useMediaUpload';

interface MediaGridProps {
  files: MediaFile[];
  onRemove: (id: string) => void;
  onNotesChange: (id: string, notes: string) => void;
  onReorder: (activeId: string, overId: string) => void;
}

export function MediaGrid({
  files,
  onRemove,
  onNotesChange,
  onReorder,
}: MediaGridProps) {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      onReorder(active.id as string, over.id as string);
    }
  };

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      collisionDetection={closestCenter}
    >
      <div className={cn(
        "grid gap-4 p-4",
        "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
        "items-start"
      )}>
        <SortableContext items={files.map(f => f.id)} strategy={rectSortingStrategy}>
          {files.map((file) => (
            <SortableMediaItem
              key={file.id}
              file={file}
              onRemove={onRemove}
              onNotesChange={onNotesChange}
            />
          ))}
        </SortableContext>
      </div>
    </DndContext>
  );
}