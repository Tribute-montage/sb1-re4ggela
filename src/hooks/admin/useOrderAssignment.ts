import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase/client';
import { toast } from 'sonner';

interface Editor {
  id: string;
  name: string;
  email: string;
}

export function useOrderAssignment(orderId: string) {
  const [assignedEditor, setAssignedEditor] = useState<Editor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAssignedEditor() {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            editor:editor_id (
              id,
              full_name,
              email
            )
          `)
          .eq('id', orderId)
          .single();

        if (error) throw error;

        if (data?.editor) {
          setAssignedEditor({
            id: data.editor.id,
            name: data.editor.full_name,
            email: data.editor.email,
          });
        }
      } catch (error) {
        console.error('Error fetching assigned editor:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAssignedEditor();
  }, [orderId]);

  const assignEditor = useCallback(async (editorId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ editor_id: editorId })
        .eq('id', orderId);

      if (error) throw error;

      // Fetch updated editor details
      const { data: editor, error: editorError } = await supabase
        .from('user_profiles')
        .select('id, full_name, email')
        .eq('id', editorId)
        .single();

      if (editorError) throw editorError;

      setAssignedEditor({
        id: editor.id,
        name: editor.full_name,
        email: editor.email,
      });

      toast.success('Editor assigned successfully');
    } catch (error) {
      console.error('Error assigning editor:', error);
      toast.error('Failed to assign editor');
    }
  }, [orderId]);

  return {
    assignedEditor,
    assignEditor,
    loading,
  };
}