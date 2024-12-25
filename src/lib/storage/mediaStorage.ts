import { supabase } from './config';
import { v4 as uuidv4 } from 'uuid';

interface FileMetadata {
  originalName: string;
  contentType: string;
  size: number;
  version: number;
  createdAt: Date;
}

export async function uploadFile(
  file: File,
  path: string,
  onProgress?: (progress: number) => void
): Promise<{ url: string; metadata: FileMetadata }> {
  const fileId = uuidv4();
  const version = await getNextVersion(path);
  const fileName = `${fileId}_v${version}_${file.name}`;
  const fullPath = `${path}/${fileName}`;

  try {
    const { data, error } = await supabase.storage
      .from('media')
      .upload(fullPath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    const metadata: FileMetadata = {
      originalName: file.name,
      contentType: file.type,
      size: file.size,
      version,
      createdAt: new Date(),
    };

    // Store metadata in database
    await supabase
      .from('file_versions')
      .insert([
        {
          file_id: fileId,
          path: fullPath,
          metadata,
        },
      ]);

    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(fullPath);

    return { url: publicUrl, metadata };
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

async function getNextVersion(path: string): Promise<number> {
  const { data, error } = await supabase
    .from('file_versions')
    .select('metadata->version')
    .eq('path', path)
    .order('metadata->version', { ascending: false })
    .limit(1);

  if (error) throw error;
  return data?.[0]?.metadata?.version + 1 || 1;
}

export async function getFileVersions(path: string): Promise<FileMetadata[]> {
  const { data, error } = await supabase
    .from('file_versions')
    .select('metadata')
    .eq('path', path)
    .order('metadata->version', { ascending: false });

  if (error) throw error;
  return data.map(row => row.metadata);
}

export async function revertToVersion(path: string, version: number): Promise<void> {
  const { data, error } = await supabase
    .from('file_versions')
    .select('path')
    .eq('path', path)
    .eq('metadata->version', version)
    .single();

  if (error || !data) throw new Error('Version not found');

  // Copy the old version to a new version
  const { error: copyError } = await supabase.storage
    .from('media')
    .copy(data.path, `${path}/latest`);

  if (copyError) throw copyError;
}