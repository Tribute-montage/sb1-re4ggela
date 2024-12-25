import React from 'react';
import { LoadingSpinner } from '../../common/LoadingSpinner';

export function AnalyticsLoading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-64 bg-gray-200 rounded-lg" />
      <div className="grid grid-cols-2 gap-4">
        <div className="h-48 bg-gray-100 rounded-lg" />
        <div className="h-48 bg-gray-100 rounded-lg" />
      </div>
    </div>
  );
}