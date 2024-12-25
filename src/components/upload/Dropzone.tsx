import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { cn } from '../../lib/utils';

interface DropzoneProps {
  onDrop: (files: File[]) => void;
  maxSize?: number;
  accept?: Record<string, string[]>;
}

export function Dropzone({ 
  onDrop, 
  maxSize = 10 * 1024 * 1024, // 10MB default
  accept = {
    'image/*': ['.jpg', '.jpeg', '.png', '.gif'],
    'video/*': ['.mp4', '.mov', '.avi']
  }
}: DropzoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize,
    accept,
    onDropRejected: (rejectedFiles) => {
      rejectedFiles.forEach(({ file, errors }) => {
        if (errors[0]?.code === 'file-too-large') {
          console.error(`${file.name} is too large`);
        } else {
          console.error(`${file.name} is not a supported file type`);
        }
      });
    },
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
        isDragActive ? "border-indigo-500 bg-indigo-50" : "border-gray-300 hover:border-indigo-400"
      )}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-2 text-sm text-gray-600">
        Drag and drop files here, or click to select files
      </p>
      <p className="text-xs text-gray-500 mt-1">
        Supported formats: JPG, PNG, GIF, MP4, MOV (max {maxSize / (1024 * 1024)}MB)
      </p>
    </div>
  );
}