import { supabase } from '../supabase/client';
import { logSecurityEvent } from '../security/audit';

interface BackupMetadata {
  timestamp: Date;
  size: number;
  fileCount: number;
  status: 'completed' | 'failed';
  error?: string;
}

export async function createBackup(orderId: string): Promise<BackupMetadata> {
  try {
    // Get all files from storage
    const { data: files, error: filesError } = await supabase.storage
      .from('media')
      .list(`orders/${orderId}`);

    if (filesError) throw filesError;

    // Create backup in separate bucket
    const backupId = new Date().toISOString();
    const backupPath = `backups/${orderId}/${backupId}`;

    // Copy each file to backup location
    let totalSize = 0;
    for (const file of files) {
      await supabase.storage
        .from('media')
        .copy(`orders/${orderId}/${file.name}`, `${backupPath}/${file.name}`);
      
      totalSize += file.metadata?.size || 0;
    }

    const backupMetadata: BackupMetadata = {
      timestamp: new Date(),
      size: totalSize,
      fileCount: files.length,
      status: 'completed',
    };

    // Store backup metadata
    await supabase.rpc('create_backup', {
      p_order_id: orderId,
      p_backup_type: 'full',
      p_storage_path: backupPath,
      p_metadata: backupMetadata,
    });

    // Log security event
    await logSecurityEvent('backup_created', 'order', orderId, backupMetadata);

    return backupMetadata;
  } catch (error) {
    console.error('Backup failed:', error);
    throw error;
  }
}

export async function restoreFromBackup(orderId: string, backupId: string): Promise<void> {
  try {
    // Get backup metadata
    const { data: backup, error } = await supabase
      .from('media_backups')
      .select('*')
      .eq('id', backupId)
      .eq('order_id', orderId)
      .single();

    if (error) throw error;

    // List files in backup
    const { data: files, error: filesError } = await supabase.storage
      .from('media')
      .list(backup.storage_path);

    if (filesError) throw filesError;

    // Restore each file
    for (const file of files) {
      await supabase.storage
        .from('media')
        .copy(
          `${backup.storage_path}/${file.name}`,
          `orders/${orderId}/${file.name}`
        );
    }

    // Log security event
    await logSecurityEvent('backup_restored', 'order', orderId, {
      backupId,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Restore failed:', error);
    throw error;
  }
}