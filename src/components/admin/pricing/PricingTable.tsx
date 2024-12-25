```typescript
import React from 'react';
import { cn } from '../../../lib/utils';

interface PricingTableProps {
  items: Array<{
    itemType: string;
    videoType: string;
    amount: number;
  }>;
}

export function PricingTable({ items }: PricingTableProps) {
  const videoTypes = ['6min-basic', '6min-scenery', '9min-basic', '9min-scenery'];
  const itemTypes = [
    { id: 'base_price', label: 'Base Price' },
    { id: 'additional_photo', label: 'Additional Photo' },
    { id: 'additional_video', label: 'Additional Video' },
    { id: 'rush_fee', label: 'Rush Fee' },
    { id: 'background_music', label: 'Background Music' },
    { id: 'scenery', label: 'Scenery' },
    { id: 'custom_verse', label: 'Custom Verse' },
  ];

  const getAmount = (itemType: string, videoType: string) => {
    const item = items.find(i => i.itemType === itemType && i.videoType === videoType);
    return item ? `$${item.amount.toFixed(2)}` : '-';
  };

  return (
    <div className="mt-4 overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Item Type
            </th>
            {videoTypes.map((type) => (
              <th key={type} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {type}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {itemTypes.map((itemType) => (
            <tr key={itemType.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {itemType.label}
              </td>
              {videoTypes.map((videoType) => (
                <td key={videoType} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getAmount(itemType.id, videoType)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```