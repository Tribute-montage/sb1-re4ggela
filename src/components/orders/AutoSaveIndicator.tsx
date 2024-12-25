import React from 'react';
import { Check, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface AutoSaveIndicatorProps {
  saving: boolean;
}

export function AutoSaveIndicator({ saving }: AutoSaveIndicatorProps) {
  return (
    <div className={cn(
      "fixed bottom-4 right-4 flex items-center space-x-2",
      "px-3 py-2 rounded-full bg-white shadow-lg",
      "text-sm text-gray-600 transition-opacity duration-200",
      saving ? "opacity-100" : "opacity-0"
    )}>
      {saving ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Saving...</span>
        </>
      ) : (
        <>
          <Check className="h-4 w-4 text-green-500" />
          <span>All changes saved</span>
        </>
      )}
    </div>
  );
}