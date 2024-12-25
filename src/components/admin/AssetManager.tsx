import React from 'react';
import { useAssets } from '../../hooks/useAssets';
import { Asset } from '../../types/order';
import { Upload, Trash2, Edit2 } from 'lucide-react';
import { storage, db } from '../../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { toast } from 'sonner';

interface AssetManagerProps {
  type: Asset['type'];
}

export function AssetManager({ type }: AssetManagerProps) {
  const { assets, loading } = useAssets(type);
  const [uploading, setUploading] = React.useState(false);
  const [editingAsset, setEditingAsset] = React.useState<Asset | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `assets/${type}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      const assetData = {
        name: file.name.replace(/\.[^/.]+$/, ''),
        type,
        url,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await addDoc(collection(db, 'assets'), assetData);
      toast.success('Asset uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload asset');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (asset: Asset) => {
    try {
      await deleteDoc(doc(db, 'assets', asset.id));
      toast.success('Asset deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete asset');
    }
  };

  const handleUpdate = async (asset: Asset, updates: Partial<Asset>) => {
    try {
      await updateDoc(doc(db, 'assets', asset.id), {
        ...updates,
        updatedAt: new Date(),
      });
      setEditingAsset(null);
      toast.success('Asset updated successfully');
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update asset');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">
          Manage {type.charAt(0).toUpperCase() + type.slice(1)} Assets
        </h2>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileSelect}
            accept={type === 'music' ? 'audio/*' : 'image/*'}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <Upload className="h-5 w-5 mr-2" />
            {uploading ? 'Uploading...' : 'Upload Asset'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {assets.map((asset) => (
          <div
            key={asset.id}
            className="relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            {asset.thumbnail && (
              <img
                src={asset.thumbnail}
                alt={asset.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            )}
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-900">{asset.name}</h3>
              <div className="mt-4 flex space-x-3">
                <button
                  onClick={() => setEditingAsset(asset)}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Edit2 className="h-4 w-4 mr-1.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(asset)}
                  className="inline-flex items-center px-3 py-1.5 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-1.5" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingAsset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Asset</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleUpdate(editingAsset, {
                  name: formData.get('name') as string,
                  tags: formData.get('tags')?.toString().split(',').map(t => t.trim()) || [],
                });
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingAsset.name}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    defaultValue={editingAsset.tags?.join(', ')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingAsset(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}