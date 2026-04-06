import React from 'react';
import styles from '@/styles/Footer.module.css';

interface FooterProps {
  childName: string;
  date: string;
  venue: string;
}

export const Footer: React.FC<FooterProps> = ({ childName, date, venue }) => {
  return (
    <footer className={styles.footerWrapper}>
      <div className={styles.footLeft}>
        Made with love for <strong>{childName}'s Birthday</strong> 🍓<br />
        2026 · {venue}
      </div>
      <div className={styles.footEmoji}>
        <span>🍓</span>
        <span>❤️</span>
        <span>🎂</span>
      </div>
    </footer>
  );
};
