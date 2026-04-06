'use client';

import React from 'react';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import styles from '@/styles/FloatingButtons.module.css';
import config from '@/data/config.json';

export const FloatingButtons: React.FC = () => {
  return (
    <div className={styles.floatingContainer}>
      <a
        href={`https://wa.me/919285248504?text=${encodeURIComponent(`Hi ${config.child.name}, I just RSVP'd for your birthday!`)}`}
        target="_blank"
        rel="noreferrer"
        className={`${styles.floatingBtn} ${styles.whatsappBtn}`}
        title="WhatsApp"
      >
        <WhatsAppIcon sx={{ fontSize: '1.5rem' }} />
      </a>
      <a
        href="#rsvp"
        className={`${styles.floatingBtn} ${styles.rsvpBtn}`}
        title="RSVP Now"
      >
        <ConfirmationNumberIcon sx={{ fontSize: '1.5rem' }} />
      </a>
    </div>
  );
};