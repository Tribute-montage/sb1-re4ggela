import React from 'react';
import { useEditors } from '../../../hooks/admin/useEditors';
import { useOrderAssignment } from '../../../hooks/admin/useOrderAssignment';
import { Users, AlertCircle } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface EditorAssignmentProps {
  orderId: string;
}

export function EditorAssignment({ orderId }: EditorAssignmentProps) {
  const { editors, loading: editorsLoading } = useEditors();
  const { assignedEditor, assignEditor, loading: assignmentLoading } = useOrderAssignment(orderId);
  const [isOpen, setIsOpen] = React.useState(false);

  const loading = editorsLoading || assignmentLoading;

  if (loading) {
    return <div className="h-10 animate-pulse bg-gray-100 rounded" />;
  }

  const handleAssign = async (editorId: string) => {
    await assignEditor(editorId);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
          assignedEditor
            ? "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            : "border-indigo-600 bg-indigo-600 text-white hover:bg-indigo-700"
        )}
      >
        <Users className="h-4 w-4 mr-2" />
        {assignedEditor ? 'Reassign Editor' : 'Assign Editor'}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1">
            {editors.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 text-yellow-500" />
                No editors available
              </div>
            ) : (
              editors.map((editor) => (
                <button
                  key={editor.id}
                  onClick={() => handleAssign(editor.id)}
                  className={cn(
                    "w-full text-left px-4 py-2 text-sm",
                    editor.id === assignedEditor?.id
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <div className="flex justify-between items-center">
                    <span>{editor.name}</span>
                    <span className="text-xs text-gray-500">
                      {editor.activeOrders} active
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}