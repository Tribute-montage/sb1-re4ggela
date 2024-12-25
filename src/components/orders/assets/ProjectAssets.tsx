```tsx
import React from 'react';
import { Download, FileText, Music, Image, Film, BookText } from 'lucide-react';
import { useOrderAssets } from '../../../hooks/useOrderAssets';
import { cn } from '../../../lib/utils';

interface ProjectAssetsProps {
  orderId: string;
}

export function ProjectAssets({ orderId }: ProjectAssetsProps) {
  const { assets, loading } = useOrderAssets(orderId);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const assetTypes = [
    { type: 'instructions', icon: FileText, label: 'Instructions' },
    { type: 'music', icon: Music, label: 'Background Music' },
    { type: 'cover', icon: Image, label: 'Cover Image' },
    { type: 'scenery', icon: Film, label: 'Scenery' },
    { type: 'verse', icon: BookText, label: 'Closing Verse' },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Project Assets</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {assetTypes.map((type) => {
          const typeAssets = assets.filter(a => a.type === type.type);
          return (
            <div
              key={type.type}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <type.icon className="h-5 w-5 text-gray-400" />
                  <h4 className="text-sm font-medium text-gray-900">{type.label}</h4>
                </div>
              </div>
              
              <div className="p-4">
                {typeAssets.length === 0 ? (
                  <p className="text-sm text-gray-500">No assets available</p>
                ) : (
                  <ul className="space-y-2">
                    {typeAssets.map((asset) => (
                      <li key={asset.id}>
                        <a
                          href={asset.url}
                          download
                          className={cn(
                            "flex items-center space-x-2 px-3 py-2 rounded-md",
                            "text-sm text-gray-600 hover:bg-gray-50"
                          )}
                        >
                          <Download className="h-4 w-4" />
                          <span className="flex-1 truncate">{asset.name}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```