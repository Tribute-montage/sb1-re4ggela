import { useState, useEffect, useCallback } from 'react';
import { getFileVersions, revertToVersion } from '../lib/versioning/fileVersioning';
import { toast } from 'sonner';

interface FileVersion {
  id: string;
  version: number;
  url: string;
  metadata: Record<string, any>;
  createdBy: string;
  createdAt: string;
}

export function useFileVersions(orderId: string, fileId: string) {
  const [versions, setVersions] = useState<FileVersion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVersions() {
      try {
        const data = await getFileVersions(orderId, fileId);
        setVersions(data);
      } catch (error) {
        console.error('Error fetching versions:', error);
        toast.error('Failed to load file versions');
      } finally {
        setLoading(false);
      }
    }

    fetchVersions();
  }, [orderId, fileId]);

  const handleRevert = useCallback(async (version: number) => {
    try {
      await revertToVersion(orderId, fileId, version);
      toast.success('Successfully reverted to version ' + version);
      
      // Refresh versions
      const data = await getFileVersions(orderId, fileId);
      setVersions(data);
    } catch (error) {
      console.error('Error reverting version:', error);
      toast.error('Failed to revert version');
    }
  }, [orderId, fileId]);

  return {
    versions,
    loading,
    revertToVersion: handleRevert,
  };
}