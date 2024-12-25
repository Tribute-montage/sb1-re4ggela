```typescript
import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { OrderFilter } from '../../../hooks/useOrderFilters';
import { DateRangePicker } from './DateRangePicker';
import { StatusFilter } from './StatusFilter';
import { VideoTypeFilter } from './VideoTypeFilter';
import { cn } from '../../../lib/utils';

interface OrderFiltersProps {
  filters: OrderFilter;
  onUpdateFilter: (key: keyof OrderFilter, value: any) => void;
  onReset: () => void;
  totalOrders: number;
  filteredCount: number;
}

export function OrderFilters({
  filters,
  onUpdateFilter,
  onReset,
  totalOrders,
  filteredCount,
}: OrderFiltersProps) {
  const hasActiveFilters = 
    filters.search ||
    filters.status.length > 0 ||
    filters.videoType.length > 0 ||
    filters.dateRange.start ||
    filters.dateRange.end;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onUpdateFilter('search', e.target.value)}
            placeholder="Search orders..."
            className={cn(
              "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md",
              "focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            )}
          />
        </div>

        {/* Filter Button */}
        <button
          type="button"
          className={cn(
            "inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium",
            hasActiveFilters
              ? "border-indigo-500 text-indigo-700 bg-indigo-50"
              : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
          )}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {hasActiveFilters && (
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              {Object.values(filters).filter(Boolean).length}
            </span>
          )}
        </button>

        {/* Reset Button */}
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <X className="h-4 w-4 mr-2" />
            Reset
          </button>
        )}
      </div>

      {/* Filter Options */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatusFilter
          selected={filters.status}
          onChange={(value) => onUpdateFilter('status', value)}
        />
        <VideoTypeFilter
          selected={filters.videoType}
          onChange={(value) => onUpdateFilter('videoType', value)}
        />
        <DateRangePicker
          startDate={filters.dateRange.start}
          endDate={filters.dateRange.end}
          onChange={(range) => onUpdateFilter('dateRange', range)}
        />
      </div>

      {/* Results Count */}
      {hasActiveFilters && (
        <p className="text-sm text-gray-500">
          Showing {filteredCount} of {totalOrders} orders
        </p>
      )}
    </div>
  );
}
```