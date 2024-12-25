```typescript
import React from 'react';
import { Save } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface VerseEditorProps {
  initialContent?: string;
  onSave: (content: string) => Promise<void>;
}

export function VerseEditor({ initialContent = '', onSave }: VerseEditorProps) {
  const [content, setContent] = React.useState(initialContent);
  const [saving, setSaving] = React.useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(content);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter verse text..."
        className={cn(
          "w-full h-64 p-4 border rounded-md",
          "focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        )}
      />
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className={cn(
            "inline-flex items-center px-4 py-2 border border-transparent",
            "rounded-md shadow-sm text-sm font-medium text-white",
            "bg-indigo-600 hover:bg-indigo-700",
            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Verse'}
        </button>
      </div>
    </div>
  );
}
```