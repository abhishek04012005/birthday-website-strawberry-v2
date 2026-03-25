'use client';

import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import config from '@/data/config.json';
import styles from '@/styles/FlyerCard.module.css';

type FlyerSize = 'a4' | 'social';

export const FlyerCard: React.FC = () => {
  const [selectedSize, setSelectedSize] = useState<FlyerSize>('a4');
  const flyerRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!flyerRef.current) return;

    try {
      const canvas = await html2canvas(flyerRef.current, {
        backgroundColor: '#fff',
        scale: 3,
        logging: false,
        allowTaint: true,
      });

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `${config.child.name}-birthday-invitation-${selectedSize}.png`;
      link.click();
    } catch (error) {
      console.error('Error generating flyer:', error);
      alert('Error generating flyer. Please try again.');
    }
  };

  return (
    <div className={styles.flyerContainer}>
      <div className={styles.controls}>
        <h2>🎟 Birthday Invitation Flyer</h2>
        <p className={styles.description}>
          Download a beautiful invitation flyer in A4 size for printing or social media sharing
        </p>
        
        <div className={styles.sizeSelector}>
          <button
            className={`${styles.sizeBtn} ${selectedSize === 'a4' ? styles.active : ''}`}
            onClick={() => setSelectedSize('a4')}
          >
            📄 A4 (Print)
          </button>
          <button
            className={`${styles.sizeBtn} ${selectedSize === 'social' ? styles.active : ''}`}
            onClick={() => setSelectedSize('social')}
          >
            📱 Social Media
          </button>
        </div>

        <button className={styles.downloadBtn} onClick={handleDownload}>
          📥 Download Flyer
        </button>
      </div>

      {/* Flyer Preview */}
      <div className={styles.flyerWrapper}>
        <div 
          ref={flyerRef} 
          className={`${styles.flyer} ${styles[selectedSize]}`}
        >
          <div className={styles.flyerBg}>
            {/* Top Accent Bar */}
            <div className={styles.accentBar}></div>

            {/* Header Section */}
            <div className={styles.flyerHeader}>
              <div className={styles.headerTop}>
                <span className={styles.decorEmoji}>🍓</span>
                <h1 className={styles.mainTitle}>You Are Invited!</h1>
                <span className={styles.decorEmoji}>🍓</span>
              </div>
              <p className={styles.partyName}>{config.party.title}</p>
            </div>

            {/* Main Content */}
            <div className={styles.flyerContent}>
              {/* Date & Time - Highlighted */}
              <div className={styles.highlightBox}>
                <div className={styles.highlightIcon}>📅</div>
                <div className={styles.highlightContent}>
                  <p className={styles.highlightLabel}>Date & Time</p>
                  <p className={styles.highlightValue}>{config.party.date}</p>
                  <p className={styles.highlightValue}>{config.party.time}</p>
                </div>
              </div>

              {/* Location */}
              <div className={styles.infoRow}>
                <div className={styles.infoCard}>
                  <div className={styles.infoCardIcon}>📍</div>
                  <p className={styles.infoCardLabel}>Venue</p>
                  <p className={styles.infoCardValue}>{config.party.venue}</p>
                </div>

                {/* Dress Code */}
                <div className={styles.infoCard}>
                  <div className={styles.infoCardIcon}>👗</div>
                  <p className={styles.infoCardLabel}>Dress Code</p>
                  <p className={styles.infoCardValue}>{config.party.dressCode}</p>
                </div>
              </div>

              {/* Activities Grid */}
              <div className={styles.activitiesSection}>
                <p className={styles.activitiesTitle}>🎉 Activities & Fun</p>
                <div className={styles.activitiesGrid}>
                  {config.party.activities.map((activity, index) => (
                    <div key={index} className={styles.activityBubble}>
                      {activity}
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Section */}
              <div className={styles.ctaSection}>
                <p className={styles.ctaMain}>Let's Celebrate Together!</p>
                <p className={styles.ctaSub}>RSVP at the provided link 💕</p>
              </div>
            </div>

            {/* Bottom Decoration */}
            <div className={styles.bottomDecor}>
              <span>🎈</span>
              <span>🎁</span>
              <span>✨</span>
              <span>🎂</span>
              <span>🍓</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className={styles.previewInfo}>
        <p>✨ Premium quality printing • Vibrant colors • Ready to print or share</p>
      </div>
    </div>
  );
};
