import React from 'react';
import { useAssets } from '../../../hooks/useAssets';
import { useFavorites } from '../../../hooks/useFavorites';
import { AssetGrid } from './AssetGrid';
import { AssetSearch } from './AssetSearch';
import { Asset } from '../../../types/order';
import { cn } from '../../../lib/utils';

interface AssetSelectorProps {
  type: Asset['type'];
  selectedId?: string;
  onSelect: (asset: Asset | null) => void;
  onNext: () => void;
  onBack: () => void;
  title: string;
  description: string;
}

export function AssetSelector({
  type,
  selectedId,
  onSelect,
  onNext,
  onBack,
  title,
  description,
}: AssetSelectorProps) {
  const { assets, loading } = useAssets(type);
  const { favorites, toggleFavorite } = useFavorites();
  const [search, setSearch] = React.useState('');

  const filteredAssets = React.useMemo(() => {
    if (!search.trim()) return assets;
    const searchLower = search.toLowerCase();
    return assets.filter(asset => 
      asset.name.toLowerCase().includes(searchLower) ||
      asset.tags?.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }, [assets, search]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-medium text-gray-900">{title}</h2>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
        <button
          onClick={() => onSelect(null)}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          No selection needed
        </button>
      </div>

      <AssetSearch
        value={search}
        onChange={setSearch}
        placeholder={`Search ${type}...`}
      />

      <AssetGrid
        assets={filteredAssets}
        selectedId={selectedId}
        favorites={favorites[type] || []}
        onSelect={onSelect}
        onToggleFavorite={(id) => toggleFavorite(type, id)}
        emptyMessage={`No ${type} found matching your search`}
      />

      <div className="flex justify-between mt-8">
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
          onClick={onNext}
          className={cn(
            "px-4 py-2 text-sm font-medium text-white",
            "bg-indigo-600 rounded-md hover:bg-indigo-700",
            "focus:outline-none focus:ring-2 focus:ring-offset-2",
            "focus:ring-indigo-500"
          )}
        >
          Next Step
        </button>
      </div>
    </div>
  );
}