import { supabase } from '../supabase/client';

interface FileVersion {
  id: string;
  version: number;
  url: string;
  metadata: Record<string, any>;
  createdBy: string;
  createdAt: string;
}

export async function createFileVersion(
  orderId: string,
  fileId: string,
  url: string,
  metadata: Record<string, any> = {}
): Promise<string> {
  try {
    const { data, error } = await supabase.rpc('create_file_version', {
      p_order_id: orderId,
      p_file_id: fileId,
      p_url: url,
      p_metadata: metadata,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating file version:', error);
    throw error;
  }
}

export async function getFileVersions(
  orderId: string,
  fileId: string
): Promise<FileVersion[]> {
  try {
    const { data, error } = await supabase
      .from('file_versions')
      .select('*')
      .eq('order_id', orderId)
      .eq('file_id', fileId)
      .order('version', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching file versions:', error);
    throw error;
  }
}

export async function revertToVersion(
  orderId: string,
  fileId: string,
  version: number
): Promise<void> {
  try {
    // Get version details
    const { data: versionData, error: versionError } = await supabase
      .from('file_versions')
      .select('*')
      .eq('order_id', orderId)
      .eq('file_id', fileId)
      .eq('version', version)
      .single();

    if (versionError) throw versionError;

    // Create new version with reverted content
    await createFileVersion(
      orderId,
      fileId,
      versionData.url,
      {
        ...versionData.metadata,
        revertedFrom: version,
      }
    );
  } catch (error) {
    console.error('Error reverting version:', error);
    throw error;
  }
}