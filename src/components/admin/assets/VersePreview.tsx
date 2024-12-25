```typescript
import React from 'react';
import { cn } from '../../../lib/utils';

interface VersePreviewProps {
  content: string;
}

export function VersePreview({ content }: VersePreviewProps) {
  return (
    <div className={cn(
      "bg-white p-6 rounded-lg shadow",
      "prose prose-indigo max-w-none"
    )}>
      <div className="whitespace-pre-wrap">{content}</div>
    </div>
  );
}
```