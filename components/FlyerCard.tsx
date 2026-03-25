'use client';

import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import config from '@/data/config.json';
import styles from '@/styles/FlyerCard.module.css';

export const FlyerCard: React.FC = () => {
  const flyerRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!flyerRef.current) return;

    try {
      const canvas = await html2canvas(flyerRef.current, {
        backgroundColor: '#fff',
        scale: 2,
        logging: false,
      });

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `${config.child.name}-birthday-invitation.png`;
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
          Create a beautiful invitation flyer to share with family and friends. Download and share via WhatsApp, email, or print it!
        </p>
        <button className={styles.downloadBtn} onClick={handleDownload}>
          📥 Download Flyer
        </button>
      </div>

      {/* Flyer Card - This will be captured and downloaded */}
      <div className={styles.flyerWrapper}>
        <div ref={flyerRef} className={styles.flyer}>
          {/* Background with decorative elements */}
          <div className={styles.flyerBg}>
            <div className={styles.flyerDecorTop}>🎈 🎉 🎁 🍓 ✨</div>

            {/* Header */}
            <div className={styles.flyerHeader}>
              <div className={styles.flyerEmoji}>{config.child.emoji}</div>
              <h1 className={styles.flyerTitle}>You're Invited!</h1>
              <p className={styles.flyerSubtitle}>{config.party.title}</p>
            </div>

            {/* Main Content */}
            <div className={styles.flyerContent}>
              <div className={styles.infoBox}>
                <div className={styles.infoItem}>
                  <span className={styles.infoIcon}>🎂</span>
                  <div className={styles.infoText}>
                    <p className={styles.infoLabel}>Date & Time</p>
                    <p className={styles.infoValue}>{config.party.date} | {config.party.time}</p>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <span className={styles.infoIcon}>📍</span>
                  <div className={styles.infoText}>
                    <p className={styles.infoLabel}>Venue</p>
                    <p className={styles.infoValue}>{config.party.venue}</p>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <span className={styles.infoIcon}>👗</span>
                  <div className={styles.infoText}>
                    <p className={styles.infoLabel}>Dress Code</p>
                    <p className={styles.infoValue}>{config.party.dressCode}</p>
                  </div>
                </div>
              </div>

              {/* Activities Section */}
              <div className={styles.activitiesBox}>
                <p className={styles.activitiesTitle}>✨ What's Happening?</p>
                <div className={styles.activitiesList}>
                  {config.party.activities.map((activity, index) => (
                    <div key={index} className={styles.activityItem}>
                      <span>{activity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Section */}
              <div className={styles.ctaBox}>
                <p className={styles.ctaText}>Join us for a magical celebration!</p>
                <p className={styles.rsvpText}>RSVP by following the invitation link</p>
              </div>
            </div>

            <div className={styles.flyerDecorBottom}>🍓 ✨ 🎉 🎈 🎁</div>
          </div>
        </div>
      </div>

      {/* Preview Info */}
      <div className={styles.previewInfo}>
        <p>
          💡 Tip: This flyer is optimized for printing (4:5 ratio, 1080x1350px)
        </p>
        <p>
          You can download this as an image and share via WhatsApp, email, or print it out!
        </p>
      </div>
    </div>
  );
};
