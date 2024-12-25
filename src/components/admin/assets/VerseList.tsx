```typescript
import React from 'react';
import { useVerseAssets } from '../../../hooks/admin/useVerseAssets';
import { VerseEditor } from './VerseEditor';
import { VersePreview } from './VersePreview';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';
import { cn } from '../../../lib/utils';

export function VerseList() {
  const { verses, loading, createVerse, updateVerse, deleteVerse } = useVerseAssets();
  const [showEditor, setShowEditor] = React.useState(false);
  const [editingVerse, setEditingVerse] = React.useState<string | null>(null);
  const [previewVerse, setPreviewVerse] = React.useState<string | null>(null);

  if (loading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-10 bg-gray-200 rounded" />
      <div className="h-64 bg-gray-100 rounded" />
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Closing Verses</h2>
        <button
          onClick={() => setShowEditor(true)}
          className={cn(
            "inline-flex items-center px-4 py-2 border border-transparent",
            "rounded-md shadow-sm text-sm font-medium text-white",
            "bg-indigo-600 hover:bg-indigo-700"
          )}
        >
          <Plus className="h-5 w-5 mr-2" />
          New Verse
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {verses.map((verse) => (
          <div key={verse.id} className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{verse.name}</h3>
                {verse.tags && verse.tags.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {verse.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPreviewVerse(verse.id)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <Eye className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setEditingVerse(verse.id)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => deleteVerse(verse.id)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            {editingVerse === verse.id && (
              <div className="mt-4">
                <VerseEditor
                  initialContent={verse.content}
                  onSave={async (content) => {
                    await updateVerse(verse.id, { content });
                    setEditingVerse(null);
                  }}
                />
              </div>
            )}

            {previewVerse === verse.id && (
              <div className="mt-4">
                <VersePreview content={verse.content || ''} />
              </div>
            )}
          </div>
        ))}
      </div>

      {showEditor && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">New Verse</h3>
            <VerseEditor
              onSave={async (content) => {
                await createVerse(`Verse ${verses.length + 1}`, content);
                setShowEditor(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
```