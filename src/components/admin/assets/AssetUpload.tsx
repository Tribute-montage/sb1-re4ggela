```typescript
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import { useAssetUpload } from '../../../hooks/admin/useAssetUpload';
import { cn } from '../../../lib/utils';
import type { Asset } from '../../../types/asset';

export function AssetUpload() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') as Asset['type'] || 'music';
  const { uploadAsset, uploading } = useAssetUpload();
  const [tags, setTags] = React.useState<string[]>([]);
  const [tagInput, setTagInput] = React.useState('');

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'audio/*': category === 'music' ? ['.mp3', '.wav'] : [],
      'image/*': ['cover', 'verse'].includes(category) ? ['.jpg', '.jpeg', '.png'] : [],
      'video/*': category === 'scenery' ? ['.mp4', '.mov'] : [],
    },
    disabled: uploading,
    onDrop: async (files) => {
      if (files.length > 0) {
        await uploadAsset(files[0], category, tags);
      }
    },
  });

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      setTags(prev => [...new Set([...prev, tagInput.trim()])]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900">Upload {category}</h2>
        <p className="mt-1 text-sm text-gray-500">
          Add new content to the {category} library for clients to choose from.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Tags</label>
          <div className="mt-1">
            <div className="flex flex-wrap gap-2 p-2 border rounded-md">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-indigo-100 text-indigo-700"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-indigo-500 hover:text-indigo-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Add tags..."
                className="flex-1 min-w-[120px] border-0 focus:ring-0 p-0 text-sm"
              />
            </div>
          </div>
        </div>

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
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto" />
            ) : (
              <>
                <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                <p className="text-sm text-gray-500">
                  Drag and drop your file here, or click to select
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```