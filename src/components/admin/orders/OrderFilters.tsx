import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { DateRangePicker } from './filters/DateRangePicker';
import { StatusFilter } from './filters/StatusFilter';
import { cn } from '../../../lib/utils';
import type { OrderFilter } from '../../../hooks/admin/useAdminOrders';

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
    filters.dateRange.start ||
    filters.dateRange.end ||
    filters.clientName;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatusFilter
          selected={filters.status}
          onChange={(value) => onUpdateFilter('status', value)}
        />
        <DateRangePicker
          startDate={filters.dateRange.start}
          endDate={filters.dateRange.end}
          onChange={(range) => onUpdateFilter('dateRange', range)}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Client Name
          </label>
          <input
            type="text"
            value={filters.clientName}
            onChange={(e) => onUpdateFilter('clientName', e.target.value)}
            className={cn(
              "mt-1 block w-full rounded-md border-gray-300 shadow-sm",
              "focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            )}
            placeholder="Filter by client name"
          />
        </div>
      </div>

      {hasActiveFilters && (
        <p className="text-sm text-gray-500">
          Showing {filteredCount} of {totalOrders} orders
        </p>
      )}
    </div>
  );
}