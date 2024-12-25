import React from 'react';
import { Asset } from '../../../types/order';
import { AssetCard } from './AssetCard';
import { AssetPreview } from './AssetPreview';

interface AssetGridProps {
  assets: Asset[];
  selectedId?: string;
  favorites: string[];
  onSelect: (asset: Asset) => void;
  onToggleFavorite: (assetId: string) => void;
  emptyMessage?: string;
}

export function AssetGrid({
  assets,
  selectedId,
  favorites,
  onSelect,
  onToggleFavorite,
  emptyMessage = 'No assets available',
}: AssetGridProps) {
  const [previewAsset, setPreviewAsset] = React.useState<Asset | null>(null);

  const sortedAssets = React.useMemo(() => {
    return [...assets].sort((a, b) => {
      // Favorites first
      const aFav = favorites.includes(a.id);
      const bFav = favorites.includes(b.id);
      if (aFav && !bFav) return -1;
      if (!aFav && bFav) return 1;
      
      // Selected item next
      if (a.id === selectedId) return -1;
      if (b.id === selectedId) return 1;
      
      // Then by date
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [assets, favorites, selectedId]);

  if (assets.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {sortedAssets.map((asset) => (
          <AssetCard
            key={asset.id}
            asset={asset}
            isSelected={asset.id === selectedId}
            isFavorite={favorites.includes(asset.id)}
            onSelect={() => onSelect(asset)}
            onToggleFavorite={() => onToggleFavorite(asset.id)}
            onPreview={() => setPreviewAsset(asset)}
          />
        ))}
      </div>

      {previewAsset && (
        <AssetPreview
          url={previewAsset.url}
          type={previewAsset.type}
          onClose={() => setPreviewAsset(null)}
        />
      )}
    </>
  );
}