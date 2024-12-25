import React from 'react';
import { Users } from 'lucide-react';
import { useEditors } from '../../../hooks/admin/useEditors';
import { cn } from '../../../lib/utils';

interface OrderAssignmentProps {
  orderId: string;
  currentEditor?: string;
  onAssign: (editorId: string) => void;
}

export function OrderAssignment({ orderId, currentEditor, onAssign }: OrderAssignmentProps) {
  const { editors, loading } = useEditors();
  const [isOpen, setIsOpen] = React.useState(false);

  if (loading) {
    return <div className="h-10 w-40 animate-pulse bg-gray-100 rounded" />;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
          currentEditor
            ? "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            : "border-indigo-600 bg-indigo-600 text-white hover:bg-indigo-700"
        )}
      >
        <Users className="h-4 w-4 mr-2" />
        {currentEditor ? 'Reassign Editor' : 'Assign Editor'}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu">
            {editors.map((editor) => (
              <button
                key={editor.id}
                onClick={() => {
                  onAssign(editor.id);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full text-left px-4 py-2 text-sm",
                  editor.id === currentEditor
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-700 hover:bg-gray-50"
                )}
                role="menuitem"
              >
                {editor.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}