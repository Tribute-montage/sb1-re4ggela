```typescript
import React from 'react';
import { cn } from '../../../lib/utils';

interface StatusFilterProps {
  selected: string[];
  onChange: (value: string[]) => void;
}

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'review', label: 'In Review' },
  { value: 'completed', label: 'Completed' },
];

export function StatusFilter({ selected, onChange }: StatusFilterProps) {
  const toggleStatus = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter(s => s !== value)
      : [...selected, value];
    onChange(newSelected);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Status
      </label>
      <div className="flex flex-wrap gap-2">
        {STATUS_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => toggleStatus(option.value)}
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