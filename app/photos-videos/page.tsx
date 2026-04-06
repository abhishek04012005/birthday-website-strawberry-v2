'use client';

import { useState, useEffect } from 'react';
import config from '@/data/config.json';
import { Navbar } from '@/components/Navbar';
import styles from '@/styles/PhotosVideos.module.css';

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

export default function PhotosVideosPage() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'images' | 'videos'>('all');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchMediaItems();
  }, []);

  const fetchMediaItems = async () => {
    try {
      const response = await fetch('/api/media');
      const result = await response.json();

      if (!response.ok) {
        console.error('Media API failed:', result);
        setErrorMessage(result?.error || 'Unable to load media.');
        setMediaItems([]);
        return;
      }

      setMediaItems(result || []);
    } catch (error) {
      console.error('Error fetching media:', error);
      setErrorMessage('Unable to load media. Please try again later.');
    } finally {
      setLoading(false);
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

  const getDownloadName = (item: MediaItem) => {
    if (item.filename) return item.filename;
    return item.type === 'image' ? 'celebration-image.jpg' : 'celebration-video.mp4';
  };

  const openPreview = (item: MediaItem) => setPreviewItem(item);
  const closePreview = () => setPreviewItem(null);

  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const mediaFilters = ['all', 'images', 'videos'] as const;

  const filteredItems = mediaItems.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'images') return item.type === 'image';
    if (filter === 'videos') return item.type === 'video';
    return true;
  });

  if (loading) {
    return (
      <div className={styles.page}>
        <Navbar childName={config.child.name} />
        <div className={styles.loadingPage}>
          <div className={styles.loadingCard}>
            <div className={styles.loadingSpinner} />
            <p className={styles.loadingText}>Loading celebration media...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Navbar childName={config.child.name} />

      <div className={styles.pageContent}>
        <div className={styles.heroBackground} />
        <div className={styles.pageInner}>
          <section className={styles.heroSection}>
            <div className={styles.heroText}>
              <p className={styles.heroEyebrow}>{config.child.name}'s Moments</p>
              <h1 className={styles.heroTitle}>
                Photos & Videos from the celebration
              </h1>
              <p className={styles.heroCopy}>
                Enjoy the happiest highlights with a warm and polished gallery experience.
              </p>
            </div>
          </section>

          {errorMessage && (
            <div className={styles.alertBox}>
              <div className={styles.alertContent}>
                <p className={styles.alertText}>
                  <strong className={styles.alertStrong}>Unable to load media:</strong> {errorMessage}
                </p>
                <button type="button" onClick={fetchMediaItems} className={styles.alertButton}>
                  Retry
                </button>
              </div>
            </div>
          )}

          <div className={styles.filterBar}>
            {mediaFilters.map((value) => {
              const label = value === 'all' ? 'All' : value === 'images' ? 'Photos' : 'Videos';
              const typeKey = value === 'images' ? 'image' : value === 'videos' ? 'video' : null;
              const count = value === 'all'
                ? mediaItems.length
                : mediaItems.filter(item => item.type === typeKey).length;

              return (
                <button
                  key={value}
                  onClick={() => setFilter(value)}
                  className={`${styles.filterButton} ${filter === value ? styles.filterButtonActive : ''}`}
                >
                  {label} ({count})
                </button>
              );
            })}
          </div>

          {filteredItems.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📷</div>
              <h3 className={styles.emptyTitle}>
                {filter === 'all' ? 'No media yet' : `No ${filter} yet`}
              </h3>
              <p className={styles.emptyText}>
                {filter === 'all'
                  ? 'Photos and videos from the celebration will appear here soon!'
                  : `${filter.charAt(0).toUpperCase() + filter.slice(1)} will be shared here soon!`
                }
              </p>
            </div>
          ) : (
            <div className={styles.grid}>
              {filteredItems.map((item) => (
                <div key={item.id} className={styles.card}>
                  <div className={styles.previewWrapper}>
                    {item.type === 'image' ? (
                      <img
                        src={getMediaUrl(item)}
                        alt={item.filename || 'Uploaded image'}
                        className={styles.previewMedia}
                      />
                    ) : (
                      <video
                        src={getMediaUrl(item)}
                        className={styles.previewMedia}
                        controls
                        preload="metadata"
                      />
                    )}

                    <div className={styles.previewOverlay}>
                      <span className={styles.previewChip}>{item.type === 'image' ? 'Photo' : 'Video'}</span>
                      <span className={styles.previewLabel}>{item.filename || item.alt || 'Memorable moment'}</span>
                    </div>

                    {item.is_featured && (
                      <div className={styles.featuredBadge}>
                        Featured
                      </div>
                    )}
                  </div>
                  <div className={styles.cardBody}>
                    <p className={styles.cardTitle}>{item.filename || item.alt || 'Uploaded media'}</p>
                    <p className={styles.cardDate}>
                      {(() => {
                        const createdAt = item.uploaded_at || item.created_at;
                        return createdAt
                          ? new Date(createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })
                          : '-';
                      })()}
                    </p>
                    <div className={styles.actionGroup}>
                      <button type="button" className={styles.actionButton} onClick={() => openPreview(item)}>
                        Preview
                      </button>
                      <a
                        className={styles.downloadButton}
                        href={getMediaUrl(item)}
                        download={getDownloadName(item)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Download
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {previewItem && (
            <div className={styles.modalOverlay} role="dialog" aria-modal="true">
              <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                  <h2 className={styles.modalTitle}>{previewItem.filename || previewItem.alt || 'Preview'}</h2>
                  <button type="button" className={styles.modalClose} onClick={closePreview} aria-label="Close preview">
                    ×
                  </button>
                </div>
                <div className={styles.modalBody}>
                  {previewItem.type === 'image' ? (
                    <img
                      src={getMediaUrl(previewItem)}
                      alt={previewItem.filename || previewItem.alt || 'Preview image'}
                      className={styles.modalMedia}
                    />
                  ) : (
                    <video
                      src={getMediaUrl(previewItem)}
                      className={styles.modalMedia}
                      controls
                      autoPlay
                    />
                  )}
                </div>
                <div className={styles.modalFooter}>
                  <a
                    className={styles.downloadButton}
                    href={getMediaUrl(previewItem)}
                    download={getDownloadName(previewItem)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Download
                  </a>
                  <button type="button" className={styles.actionButton} onClick={closePreview}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
