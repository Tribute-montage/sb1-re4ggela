```typescript
import React from 'react';
import { cn } from '../../../lib/utils';

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (range: { start: Date | null; end: Date | null }) => void;
}

export function DateRangePicker({
  startDate,
  endDate,
  onChange,
}: DateRangePickerProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Date Range
      </label>
      <div className="flex items-center space-x-2">
        <input
          type="date"
          value={startDate?.toISOString().split('T')[0] || ''}
          onChange={(e) => {
            const date = e.target.value ? new Date(e.target.value) : null;
            onChange({ start: date, end: endDate });
          }}
          className={cn(
            "block w-full rounded-md border-gray-300 shadow-sm",
            "focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          )}
        />
        <span className="text-gray-500">to</span>
        <input
          type="date"
          value={endDate?.toISOString().split('T')[0] || ''}
          onChange={(e) => {
            const date = e.target.value ? new Date(e.target.value) : null;
            onChange({ start: startDate, end: date });
          }}
          min={startDate?.toISOString().split('T')[0]}
          className={cn(
            "block w-full rounded-md border-gray-300 shadow-sm",
            "focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          )}
        />
      </div>
    </div>
  );
}
```