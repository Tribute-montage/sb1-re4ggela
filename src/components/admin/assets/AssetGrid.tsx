```typescript
import React from 'react';
import { Music, Image, Film, BookText, Trash2, Edit2, Eye } from 'lucide-react';
import { AssetPreview } from './AssetPreview';
import { AssetEditModal } from './AssetEditModal';
import { cn } from '../../../lib/utils';
import type { Asset } from '../../../types/asset';

interface AssetGridProps {
  assets: Asset[];
  loading?: boolean;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Asset>) => void;
}

export function AssetGrid({ assets, loading, onDelete, onUpdate }: AssetGridProps) {
  const [previewAsset, setPreviewAsset] = React.useState<Asset | null>(null);
  const [editingAsset, setEditingAsset] = React.useState<Asset | null>(null);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="aspect-square animate-pulse bg-gray-200 rounded-lg" />
        ))}
      </div>
    );
  }

  const TypeIcon = {
    music: Music,
    cover: Image,
    scenery: Film,
    verse: BookText,
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {assets.map((asset) => {
          const Icon = TypeIcon[asset.type];
          return (
            <div
              key={asset.id}
              className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-square relative">
                {asset.thumbnailUrl ? (
                  <img
                    src={asset.thumbnailUrl}
                    alt={asset.name}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-t-lg">
                    <Icon className="h-12 w-12 text-gray-400" />
                  </div>
                )}

                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setPreviewAsset(asset)}
                      className="p-2 bg-white rounded-full hover:bg-gray-100"
                    >
                      <Eye className="h-4 w-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => setEditingAsset(asset)}
                      className="p-2 bg-white rounded-full hover:bg-gray-100"
                    >
                      <Edit2 className="h-4 w-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => onDelete(asset.id)}
                      className="p-2 bg-white rounded-full hover:bg-gray-100"
                    >
                      <Trash2 className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {asset.name}
                </h3>
                {asset.tags && asset.tags.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {asset.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {previewAsset && (
        <AssetPreview
          asset={previewAsset}
          onClose={() => setPreviewAsset(null)}
        />
      )}

      {editingAsset && (
        <AssetEditModal
          asset={editingAsset}
          onSave={(updates) => {
            onUpdate(editingAsset.id, updates);
            setEditingAsset(null);
          }}
          onClose={() => setEditingAsset(null)}
        />
      )}
    </>
  );
}
```