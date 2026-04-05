'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import styles from '@/styles/GalleryManagement.module.css';

interface MediaItem {
  id: string;
  filename?: string;
  alt?: string;
  url?: string;
  drive_file_id?: string;
  type: 'image' | 'video';
  uploaded_at?: string;
  created_at?: string;
  is_featured: boolean;
}

export default function GalleryManagementClient() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchMediaItems();
  }, []);

  const fetchMediaItems = async () => {
    try {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMediaItems(data || []);
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('media')
        .update({ is_featured: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      await fetchMediaItems();
    } catch (error) {
      console.error('Error updating featured status:', error);
    }
  };

  const deleteItems = async () => {
    if (selectedItems.size === 0) return;

    if (!confirm(`Delete ${selectedItems.size} selected item(s)?`)) return;

    try {
      const { error } = await supabase
        .from('media')
        .delete()
        .in('id', Array.from(selectedItems));

      if (error) throw error;

      setSelectedItems(new Set());
      await fetchMediaItems();
    } catch (error) {
      console.error('Error deleting items:', error);
    }
  };

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedItems);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedItems(newSelection);
  };

  const selectAll = () => {
    if (selectedItems.size === mediaItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(mediaItems.map(item => item.id)));
    }
  };

  const getMediaUrl = (item: MediaItem) => {
    if (item.url) {
      return item.url;
    }
    if (!item.drive_file_id) {
      return undefined;
    }
    if (item.type === 'image') {
      return `https://lh3.googleusercontent.com/d/${encodeURIComponent(item.drive_file_id)}?sz=0`;
    }
    return `https://drive.google.com/uc?export=download&id=${encodeURIComponent(item.drive_file_id)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gallery Management</h1>
          <div className="flex gap-4">
            <button
              onClick={selectAll}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {selectedItems.size === mediaItems.length ? 'Deselect All' : 'Select All'}
            </button>
            {selectedItems.size > 0 && (
              <button
                onClick={deleteItems}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete Selected ({selectedItems.size})
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mediaItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={selectedItems.has(item.id)}
                  onChange={() => toggleSelection(item.id)}
                  className="absolute top-2 left-2 z-10"
                />
                {item.type === 'video' ? (
                  <video
                    src={getMediaUrl(item)}
                    className="w-full h-48 object-contain"
                    controls
                  />
                ) : (
                  <img
                    src={getMediaUrl(item)}
                    alt={item.filename || 'Uploaded image'}
                    className="w-full h-48 object-contain"
                  />
                )}
                {item.is_featured && (
                  <div className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold">
                    Featured
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 truncate">{item.filename || item.alt || 'Uploaded media'}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(item.uploaded_at || item.created_at || '').toLocaleDateString()}
                </p>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => toggleFeatured(item.id, item.is_featured)}
                    className={`px-3 py-1 rounded text-sm ${
                      item.is_featured
                        ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {item.is_featured ? 'Unfeature' : 'Feature'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {mediaItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No media items found.</p>
            <p className="text-gray-400">Upload some photos and videos first!</p>
          </div>
        )}
      </div>
    </div>
  );
}