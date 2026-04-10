import React, { useState, useEffect } from 'react';
import styles from '@/styles/Gallery.module.css';

interface GalleryProps {
  gallery: Array<{
    url: string;
    alt: string;
    badge: string;
    text: string;
  }>;
}

export const Gallery: React.FC<GalleryProps> = ({ gallery }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === 'ArrowLeft') navLightbox(-1);
      if (e.key === 'ArrowRight') navLightbox(1);
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const navLightbox = (dir: number) => {
    setLightboxIndex((prev) => (prev + dir + gallery.length) % gallery.length);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === 'ArrowLeft') navLightbox(-1);
      if (e.key === 'ArrowRight') navLightbox(1);
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);

  return (
    <section className={styles.galleryBg} id="gallery">
      <div className={styles.secHead}>
        <div className={styles.secPill}>📸 Sweet Memories</div>
        <h2 className={styles.secTitle}>🍓 Memories 🍓</h2>
        <p className={styles.secSub}>Click any photo to zoom in — sneak peeks of our sweetest moments!</p>
      </div>

      <div className={styles.galleryGrid}>
        {gallery.map((img, idx) => (
          <div key={idx} className={styles.galItem} onClick={() => openLightbox(idx)}>
            <img src={img.url} alt={img.alt} />
            <div className={styles.galBadge}>{img.badge}</div>
            <div className={styles.galOverlay}>
              <span className={styles.galText}>{img.text}</span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.galStrip}>
        {gallery.map((img, idx) => (
          <div key={idx} className={styles.galMini} onClick={() => openLightbox(idx)}>
            <img src={img.url} alt="" />
          </div>
        ))}
      </div>

      {lightboxOpen && (
        <div className={`${styles.lightbox} ${styles.open}`} onClick={closeLightbox}>
          <div className={styles.lbImgWrap} onClick={(e) => e.stopPropagation()}>
            <button className={styles.lbClose} onClick={closeLightbox}>✕</button>
            <button className={`${styles.lbNav} ${styles.lbPrev}`} onClick={() => navLightbox(-1)}>‹</button>
            <img
              src={gallery[lightboxIndex]?.url}
              alt=""
            />
            <button className={`${styles.lbNav} ${styles.lbNext}`} onClick={() => navLightbox(1)}>›</button>
          </div>
        </div>
      )}
    </section>
  );
};
