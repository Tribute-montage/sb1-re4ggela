```typescript
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { Asset } from '../../../types/asset';

interface AssetUploadButtonProps {
  category: Asset['type'];
}

export function AssetUploadButton({ category }: AssetUploadButtonProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/admin/assets/upload?category=${category}`)}
      className={cn(
        "inline-flex items-center px-4 py-2 border border-transparent",
        "rounded-md shadow-sm text-sm font-medium text-white",
        "bg-indigo-600 hover:bg-indigo-700",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      )}
    >
      <Upload className="h-5 w-5 mr-2" />
      Upload {category}
    </button>
  );
}
```