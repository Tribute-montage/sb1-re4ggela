import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface MediaDropzoneProps {
  onDrop: (files: File[]) => void;
}

const ACCEPTED_TYPES = {
  'image/*': ['.jpg', '.jpeg', '.png', '.gif'],
  'video/*': ['.mp4', '.mov', '.avi']
};

const MAX_SIZE = 100 * 1024 * 1024; // 100MB

export function MediaDropzone({ onDrop }: MediaDropzoneProps) {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections,
  } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_SIZE,
    multiple: true,
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8",
          "transition-colors duration-200 ease-in-out",
          isDragActive && !isDragReject && "border-indigo-500 bg-indigo-50",
          isDragReject && "border-red-500 bg-red-50",
          !isDragActive && "border-gray-300 hover:border-indigo-400"
        )}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            Drag and drop files here, or click to select files
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Supported formats: JPG, PNG, GIF, MP4, MOV (max 100MB)
          </p>
        </div>
      </div>

      {fileRejections.length > 0 && (
        <div className="mt-4">
          {fileRejections.map(({ file, errors }) => (
            <div
              key={file.name}
              className="flex items-start space-x-2 text-sm text-red-600 bg-red-50 rounded-md p-3"
            >
              <X className="h-5 w-5 flex-shrink-0" />
              <div>
                <p className="font-medium">{file.name}</p>
                <ul className="mt-1 list-disc list-inside">
                  {errors.map(error => (
                    <li key={error.code}>{error.message}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}