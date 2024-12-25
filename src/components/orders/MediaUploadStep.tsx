import React from 'react';
import { useMediaUpload } from '../../hooks/useMediaUpload';
import { MediaDropzone } from './upload/MediaDropzone';
import { MediaGrid } from './upload/MediaGrid';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';

interface MediaUploadStepProps {
  orderId: string;
  onComplete: (urls: string[]) => void;
  onBack: () => void;
}

export function MediaUploadStep({ orderId, onComplete, onBack }: MediaUploadStepProps) {
  const {
    files,
    addFiles,
    removeFile,
    updateFileNotes,
    reorderFiles,
    uploadProgress,
  } = useMediaUpload(orderId);

  const handleComplete = async () => {
    if (files.length === 0) {
      toast.error('Please upload at least one file');
      return;
    }

    const incompleteFiles = files.filter(f => f.status !== 'completed');
    if (incompleteFiles.length > 0) {
      toast.error('Please wait for all files to finish uploading');
      return;
    }

    const urls = files
      .sort((a, b) => a.order - b.order)
      .map(file => file.url!)
      .filter(Boolean);
    
    if (urls.length === 0) {
      toast.error('No valid URLs found');
      return;
    }

    onComplete(urls);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900">Upload Media Files</h2>
        <p className="mt-1 text-sm text-gray-500">
          Upload photos and videos for your tribute montage. You can reorder them by dragging and add notes to each file.
        </p>
      </div>

      <MediaDropzone onDrop={addFiles} />

      {files.length > 0 && (
        <>
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-900">
                Uploaded Files ({files.length})
              </h3>
            </div>
            <MediaGrid
              files={files}
              onRemove={removeFile}
              onNotesChange={updateFileNotes}
              onReorder={reorderFiles}
            />
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-indigo-600 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  {files.filter(f => f.status === 'completed').length} of {files.length} files uploaded
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className={cn(
            "px-4 py-2 text-sm font-medium text-gray-700",
            "bg-white border border-gray-300 rounded-md",
            "hover:bg-gray-50 focus:outline-none focus:ring-2",
            "focus:ring-offset-2 focus:ring-indigo-500"
          )}
        >
          Back
        </button>
        <button
          onClick={handleComplete}
          disabled={files.length === 0 || files.some(f => f.status === 'uploading')}
          className={cn(
            "px-4 py-2 text-sm font-medium text-white",
            "bg-indigo-600 rounded-md hover:bg-indigo-700",
            "focus:outline-none focus:ring-2 focus:ring-offset-2",
            "focus:ring-indigo-500 disabled:opacity-50",
            "disabled:cursor-not-allowed"
          )}
        >
          Next Step
        </button>
      </div>
    </div>
  );
}