'use client';

import { useEffect } from 'react';

const AUDIO_SRC = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

export default function BackgroundMusic() {
  useEffect(() => {
    const audio = new Audio(AUDIO_SRC);
    audio.loop = true;
    audio.volume = 0.45;
    audio.preload = 'auto';

    (window as any).__birthdayMusicAudio = audio;
    (window as any).__birthdayMusicReady = true;

    return () => {
      audio.pause();
      audio.src = '';
      (window as any).__birthdayMusicAudio = undefined;
      (window as any).__birthdayMusicReady = false;
    };
  }, []);

  return null;
}
