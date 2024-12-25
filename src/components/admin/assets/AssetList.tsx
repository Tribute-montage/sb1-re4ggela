```typescript
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAssets } from '../../../hooks/admin/useAssets';
import { AssetGrid } from './AssetGrid';
import { AssetSearch } from './AssetSearch';
import { AssetUploadButton } from './AssetUploadButton';
import type { Asset } from '../../../types/asset';

export function AssetList() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') as Asset['type'] || 'music';
  const { assets, loading, deleteAsset, updateAsset } = useAssets(category);
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredAssets = React.useMemo(() => {
    if (!searchTerm) return assets;
    const term = searchTerm.toLowerCase();
    return assets.filter(asset => 
      asset.name.toLowerCase().includes(term) ||
      asset.tags?.some(tag => tag.toLowerCase().includes(term))
    );
  }, [assets, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <AssetSearch value={searchTerm} onChange={setSearchTerm} />
        <AssetUploadButton category={category} />
      </div>

      <AssetGrid
        assets={filteredAssets}
        loading={loading}
        onDelete={deleteAsset}
        onUpdate={updateAsset}
      />
    </div>
  );
}
```