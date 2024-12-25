```typescript
import React from 'react';
import { cn } from '../../../lib/utils';

interface VideoTypeFilterProps {
  selected: string[];
  onChange: (value: string[]) => void;
}

const VIDEO_OPTIONS = [
  { value: '6min-basic', label: '6min Basic' },
  { value: '6min-scenery', label: '6min Scenery' },
  { value: '9min-basic', label: '9min Basic' },
  { value: '9min-scenery', label: '9min Scenery' },
];

export function VideoTypeFilter({ selected, onChange }: VideoTypeFilterProps) {
  const toggleType = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter(t => t !== value)
      : [...selected, value];
    onChange(newSelected);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Video Type
      </label>
      <div className="flex flex-wrap gap-2">
        {VIDEO_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => toggleType(option.value)}
            className={cn(
              "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
              selected.includes(option.value)
                ? "bg-indigo-100 text-indigo-800"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
```