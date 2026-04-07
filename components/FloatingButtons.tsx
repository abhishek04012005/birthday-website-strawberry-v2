'use client';

import React, { useEffect, useState } from 'react';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import styles from '@/styles/FloatingButtons.module.css';
import config from '@/data/config.json';

export const FloatingButtons: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioReady, setAudioReady] = useState(false);

  useEffect(() => {
    const checkAudio = () => {
      const globalAudio = (window as any).__birthdayMusicAudio as HTMLAudioElement | undefined;
      if (globalAudio) {
        setAudioReady(true);
      }
    };

    checkAudio();
    window.addEventListener('load', checkAudio);
    return () => window.removeEventListener('load', checkAudio);
  }, []);

  const toggleAudio = async () => {
    const globalAudio = (window as any).__birthdayMusicAudio as HTMLAudioElement | undefined;
    if (!globalAudio) return;

    if (isPlaying) {
      globalAudio.pause();
      setIsPlaying(false);
    } else {
      try {
        await globalAudio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    }
  };

  return (
    <div className={styles.floatingContainer}>
      <button
        type="button"
        className={`${styles.floatingBtn} ${styles.audioBtn}`}
        onClick={toggleAudio}
        title={isPlaying ? 'Pause background music' : 'Play background music'}
        disabled={!audioReady}
      >
        {isPlaying ? <PauseIcon sx={{ fontSize: '1.5rem' }} /> : <PlayArrowIcon sx={{ fontSize: '1.5rem' }} />}
      </button>
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
