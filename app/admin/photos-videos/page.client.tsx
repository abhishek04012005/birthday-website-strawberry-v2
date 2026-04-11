'use client';

import { useState, useRef, useEffect } from 'react';
import config from '@/data/config.json';
import styles from '@/styles/AdminPhotosVideos.module.css';

interface MediaItem {
  id: string;
  filename?: string;
  alt?: string;
  url?: string;
  drive_file_id?: string;
  type: 'image' | 'video';
  uploaded_at?: string;
  created_at?: string;
}

interface StorageInfo {
  limit: number;
  usage: number;
  remaining: number;
}

export default function PhotosVideosClient() {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [storageInfo, setStorageInfo] = useState<StorageInfo | null>(null);
  const [loadingMedia, setLoadingMedia] = useState(true);
  const [multiDeleteLoading, setMultiDeleteLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMediaItems();
    fetchStorageInfo();
  }, []);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const index = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, index)).toFixed(1)} ${units[index]}`;
  };

  const getMediaUrl = (item: MediaItem) => {
    if (item.type === 'video' && item.drive_file_id) {
      return `/api/media/stream/${encodeURIComponent(item.drive_file_id)}`;
    }
    if (item.url) {
      return item.url;
    }
    if (!item.drive_file_id) {
      return undefined;
    }
    return `https://lh3.googleusercontent.com/d/${encodeURIComponent(item.drive_file_id)}?sz=0`;
  };

  const fetchMediaItems = async () => {
    setLoadingMedia(true);
    try {
      const response = await fetch('/api/media');
      let data: any;

      const text = await response.text();
      try {
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        console.warn('Media API response not valid JSON:', text, parseError);
        data = { error: text || 'Unexpected response from media API' };
      }

      if (!response.ok) {
        const errorMessage =
          data?.error ||
          data?.details ||
          (text ? text : undefined) ||
          `Failed to load media items (${response.status})`;

        console.error('Media API error:', response.status, data ?? text);
        setMessage(errorMessage);
        setMediaItems([]);
      } else {
        const items = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
          ? data.data
          : [];

        if (!Array.isArray(items)) {
          console.warn('Unexpected media response shape:', data);
        }

        setMediaItems(items);
        setMessage('');
      }

      setSelectedItems(new Set());
    } catch (error) {
      console.error('Error loading media items:', error);
      setMessage('Failed to load media items.');
      setMediaItems([]);
    } finally {
      setLoadingMedia(false);
    }
  };

  const fetchStorageInfo = async () => {
    try {
      const response = await fetch('/api/upload-media');
      if (!response.ok) {
        throw new Error('Storage info fetch failed');
      }
      const data = await response.json();
      setStorageInfo({
        limit: Number(data.limit || 0),
        usage: Number(data.usage || 0),
        remaining: Number(data.remaining || 0),
      });
    } catch (error) {
      console.error('Error fetching storage info:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);
    setMessage('');

    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(percentComplete);
        }
      });

      const response = await new Promise<Response>((resolve, reject) => {
        xhr.open('POST', '/api/upload-media');
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(new Response(xhr.response, { status: xhr.status, statusText: xhr.statusText }));
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };
        xhr.onerror = () => reject(new Error('Network error'));
        xhr.send(formData);
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      setMessage(`Successfully uploaded ${result.uploadedCount} file(s)`);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      await fetchMediaItems();
      await fetchStorageInfo();
    } catch (error) {
      console.error('Upload error:', error);
      setMessage('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    const items = Array.isArray(mediaItems) ? mediaItems : [];
    if (selectedItems.size === items.length) {
      setSelectedItems(new Set());
      return;
    }

    setSelectedItems(new Set(items.map((item) => item.id)));
  };

  const deleteMediaItem = async (id: string) => {
    try {
      const response = await fetch(`/api/media/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Delete failed');
      }
      setMessage('Media deleted successfully.');
      await fetchMediaItems();
      await fetchStorageInfo();
    } catch (error) {
      console.error('Delete error:', error);
      setMessage('Failed to delete media item.');
    }
  };

  const deleteSelectedItems = async () => {
    if (selectedItems.size === 0) return;
    if (!confirm(`Delete ${selectedItems.size} selected item(s)?`)) return;

    setMultiDeleteLoading(true);
    try {
      await Promise.all(
        Array.from(selectedItems).map(async (id) => {
          const response = await fetch(`/api/media/${id}`, { method: 'DELETE' });
          if (!response.ok) {
            throw new Error(`Failed to delete ${id}`);
          }
        })
      );
      setMessage(`${selectedItems.size} media item(s) deleted successfully.`);
      setSelectedItems(new Set());
      await fetchMediaItems();
      await fetchStorageInfo();
    } catch (error) {
      console.error('Delete selected error:', error);
      setMessage('Failed to delete selected items.');
    } finally {
      setMultiDeleteLoading(false);
    }
  };

  const safeMediaItems = Array.isArray(mediaItems) ? mediaItems : [];
  const isErrorMessage = message.includes('failed') || message.includes('error');

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.pageContent}>
        <div className={styles.card}>
          <div className={styles.hero}>
            <h1 className={styles.heroTitle}>Upload Photos & Videos</h1>
            <p className={styles.heroSubtitle}>Share memories from {config.child.name}&apos;s birthday party</p>
          </div>

          <div className={styles.cardBody}>
            <div className={styles.section}>
              <label className={styles.sectionLabel}>Select Files to Upload</label>
              <div className={styles.fileUploadArea}>
                <div className={styles.fileUploadInner}>
                  <svg
                    className={styles.uploadIcon}
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <div className={styles.fileInstructions}>
                    <label htmlFor="file-upload" className={styles.uploadButton}>
                      <span>Choose Files</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        className={styles.fileInput}
                        onChange={handleFileUpload}
                        disabled={uploading}
                        ref={fileInputRef}
                      />
                    </label>
                    <p className={styles.uploadHint}>or drag and drop</p>
                  </div>

                  <p className={styles.uploadText}>
                    PNG, JPG, GIF, MP4, MOV up to 100MB each
                  </p>
                </div>
              </div>
            </div>

            {uploading && (
              <div className={styles.progressSection}>
                <div className={styles.progressHeader}>
                  <span>Uploading files...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${uploadProgress}%` }} />
                </div>
                <p className={styles.progressHint}>Please wait while we upload your files to Google Drive</p>
              </div>
            )}

            {message && (
              <div className={`${styles.messageBox} ${isErrorMessage ? styles.error : styles.success}`}>
                <div className={styles.messageRow}>
                  <div className={`${styles.messageIcon} ${isErrorMessage ? styles.errorIcon : styles.successIcon}`}>
                    {isErrorMessage ? (
                      <svg className={styles.iconGraphic} viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg className={styles.iconGraphic} viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <p className={styles.messageText}>{message}</p>
                </div>
              </div>
            )}

            <div className={styles.storageCard}>
              <h3 className={styles.storageTitle}>Google Drive Storage</h3>
              {storageInfo ? (
                <div className={styles.storageRow}>
                  <div className={styles.storageMetric}>
                    <span className={styles.storageLabel}>Used</span>
                    <span className={styles.storageValue}>{formatBytes(storageInfo.usage)}</span>
                  </div>
                  <div className={styles.storageMetric}>
                    <span className={styles.storageLabel}>Available</span>
                    <span className={styles.storageValue}>{formatBytes(storageInfo.remaining)}</span>
                  </div>
                  <div className={styles.storageMetric}>
                    <span className={styles.storageLabel}>Quota</span>
                    <span className={styles.storageValue}>{formatBytes(storageInfo.limit)}</span>
                  </div>
                </div>
              ) : (
                <p className={styles.storageLoading}>Loading drive storage info…</p>
              )}
            </div>

            <div className={styles.guidelinesCard}>
              <div className={styles.guidelinesRow}>
                <div>
                  <h3 className={styles.guidelinesTitle}>Upload Guidelines</h3>
                  <ul className={styles.guidelineList}>
                    <li className={styles.guidelineItem}>
                      <span className={styles.guidelineStrong}>Supported formats:</span> Images (PNG, JPG, GIF) and Videos (MP4, MOV)
                    </li>
                    <li className={styles.guidelineItem}>
                      <span className={styles.guidelineStrong}>Maximum file size:</span> 100MB per file
                    </li>
                    <li className={styles.guidelineItem}>
                      <span className={styles.guidelineStrong}>Storage:</span> Files are automatically uploaded to Google Drive
                    </li>
                    <li className={styles.guidelineItem}>
                      <span className={styles.guidelineStrong}>Management:</span> Use the Gallery Management tab to organize and feature content
                    </li>
                    <li className={styles.guidelineItem}>
                      <span className={styles.guidelineStrong}>Privacy:</span> All uploads are private and only visible to admin users
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className={styles.mediaTableWrapper}>
              <div className={styles.tableHeader}>
                <h3>Uploaded Media</h3>
                <button
                  onClick={deleteSelectedItems}
                  className={styles.deleteSelectedBtn}
                  disabled={selectedItems.size === 0 || multiDeleteLoading}
                >
                  Delete Selected ({selectedItems.size})
                </button>
              </div>

              {loadingMedia ? (
                <p className={styles.loadingText}>Loading uploaded media...</p>
              ) : mediaItems.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>No uploaded files yet.</p>
                </div>
              ) : (
                <div className={styles.tableScroll}>
                  <table className={styles.mediaTable}>
                    <thead>
                      <tr>
                        <th className={styles.checkboxCell}>
                          <label className={styles.selectAllLabel}>
                            <input
                              type="checkbox"
                              checked={selectedItems.size === safeMediaItems.length}
                              onChange={toggleSelectAll}
                            />
                            All
                          </label>
                        </th>
                        <th>Preview</th>
                        <th>Filename</th>
                        <th>Type</th>
                        <th>Uploaded</th>
                        <th className={styles.actionCell}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {safeMediaItems.map((item) => {
                        const createdAt = item.uploaded_at || item.created_at || '';
                        return (
                          <tr key={item.id}>
                            <td>
                              <input
                                type="checkbox"
                                checked={selectedItems.has(item.id)}
                                onChange={() => toggleSelection(item.id)}
                              />
                            </td>
                            <td>
                              {item.type === 'image' ? (
                                <img
                                  src={getMediaUrl(item)}
                                  alt={item.filename || 'Uploaded image'}
                                  className={styles.mediaPreview}
                                />
                              ) : (
                                <video
                                  src={getMediaUrl(item)}
                                  className={styles.mediaPreview}
                                  controls
                                  preload="metadata"
                                />
                              )}
                            </td>
                            <td>{item.filename || item.alt || 'Uploaded media'}</td>
                            <td>{item.type}</td>
                            <td>{createdAt ? new Date(createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '-'}</td>
                            <td>
                              <button
                                type="button"
                                className={styles.rowActionBtn}
                                onClick={() => deleteMediaItem(item.id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
