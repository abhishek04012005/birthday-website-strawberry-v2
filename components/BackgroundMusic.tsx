'use client';
import { useEffect } from 'react';

const AUDIO_SRC = '/hbd_instrumental.mp3';

export default function BackgroundMusic() {
  useEffect(() => {
    const audio = new Audio(AUDIO_SRC);
    audio.loop = true;
    audio.muted = true;
    audio.volume = 0.45;
    audio.preload = 'auto';

    (window as any).__birthdayMusicAudio = audio;
    (window as any).__birthdayMusicReady = true;
    (window as any).__birthdayMusicMuted = true;

    audio
      .play()
      .catch(() => {
        // Autoplay failed, will be triggered on user interaction
      });

    // Unmute on first user interaction
    const unmuteOnInteraction = async () => {
      if ((window as any).__birthdayMusicMuted) {
        audio.muted = false;
        (window as any).__birthdayMusicMuted = false;
        
        // Ensure audio is playing
        try {
          await audio.play();
        } catch {
          // Ignore play errors
        }
        
        // Remove listeners after first interaction
        document.removeEventListener('click', unmuteOnInteraction);
        document.removeEventListener('touchstart', unmuteOnInteraction);
        document.removeEventListener('keydown', unmuteOnInteraction);
      }
    };

    document.addEventListener('click', unmuteOnInteraction, { once: true });
    document.addEventListener('touchstart', unmuteOnInteraction, { once: true });
    document.addEventListener('keydown', unmuteOnInteraction, { once: true });

    return () => {
      audio.pause();
      audio.src = '';
      document.removeEventListener('click', unmuteOnInteraction);
      document.removeEventListener('touchstart', unmuteOnInteraction);
      document.removeEventListener('keydown', unmuteOnInteraction);
      (window as any).__birthdayMusicAudio = undefined;
      (window as any).__birthdayMusicReady = false;
    };
  }, []);

  return null;
}
