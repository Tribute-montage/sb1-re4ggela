```typescript
import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface DraftUploaderProps {
  onUpload: (file: File) => Promise<void>;
}

export function DraftUploader({ onUpload }: DraftUploaderProps) {
  const [uploading, setUploading] = React.useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'video/*': ['.mp4', '.mov'] },
    maxFiles: 1,
    disabled: uploading,
    onDrop: async (files) => {
      if (files.length > 0) {
        setUploading(true);
        try {
          await onUpload(files[0]);
        } finally {
          setUploading(false);
        }
      }
    },
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-lg p-12 text-center",
        isDragActive ? "border-indigo-500 bg-indigo-50" : "border-gray-300",
        uploading && "opacity-50 cursor-not-allowed"
      )}
    >
      <input {...getInputProps()} />
      <div className="space-y-2">
        {uploading ? (
          <>
            <Loader2 className="h-8 w-8 text-indigo-500 mx-auto animate-spin" />
            <p className="text-sm text-gray-500">Uploading draft...</p>
          </>
        ) : (
          <>
            <Upload className="h-8 w-8 text-gray-400 mx-auto" />
            <p className="text-sm text-gray-500">
              Drag and drop your draft video here, or click to select
            </p>
          </>
        )}
      </div>
    </div>
  );
}
```