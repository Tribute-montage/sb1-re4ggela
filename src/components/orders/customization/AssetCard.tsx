import React from 'react';
import { Film, Image as ImageIcon, Music, BookText, Eye, Heart } from 'lucide-react';
import { Asset } from '../../../types/order';
import { cn } from '../../../lib/utils';

interface AssetCardProps {
  asset: Asset;
  isSelected: boolean;
  isFavorite: boolean;
  onSelect: () => void;
  onToggleFavorite: () => void;
  onPreview: () => void;
}

export function AssetCard({
  asset,
  isSelected,
  isFavorite,
  onSelect,
  onToggleFavorite,
  onPreview,
}: AssetCardProps) {
  const AssetIcon = {
    music: Music,
    cover: ImageIcon,
    scenery: Film,
    verse: BookText,
  }[asset.type];

  return (
    <div
      className={cn(
        "relative group rounded-lg overflow-hidden bg-white",
        "border-2 transition-all duration-200",
        isSelected ? "border-indigo-500 shadow-md" : "border-transparent hover:border-gray-300"
      )}
    >
      {/* Preview */}
      <div
        className="aspect-square bg-gray-100 cursor-pointer"
        onClick={onPreview}
      >
        {asset.thumbnail ? (
          <img
            src={asset.thumbnail}
            alt={asset.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <AssetIcon className="h-12 w-12 text-gray-400" />
          </div>
        )}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors">
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onPreview}
            className="p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-100"
            title="Preview"
          >
            <Eye className="h-4 w-4 text-gray-600" />
          </button>
          <button
            onClick={onToggleFavorite}
            className={cn(
              "p-1.5 rounded-full shadow-sm",
              isFavorite
                ? "bg-red-500 text-white"
                : "bg-white text-gray-600 hover:text-red-500"
            )}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              className="h-4 w-4"
              fill={isFavorite ? "currentColor" : "none"}
            />
          </button>
        </div>
      </div>

      {/* Info */}
      <div
        className="p-3 cursor-pointer"
        onClick={onSelect}
      >
        <h3 className="font-medium text-gray-900 truncate">
          {asset.name}
        </h3>
        {asset.duration && (
          <p className="text-sm text-gray-500">
            Duration: {Math.round(asset.duration)}s
          </p>
        )}
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
}