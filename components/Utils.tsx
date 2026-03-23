import React from 'react';
import styles from '@/styles/Utils.module.css';

interface WaveProps {
  bgColor?: string;
  svgColor?: string;
}

export const Wave: React.FC<WaveProps> = ({ bgColor = '#fff0f4', svgColor = '#fffaf5' }) => {
  return (
    <div className={styles.wave} style={{ background: bgColor }}>
      <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <path
          d="M0,55 C280,5 560,80 840,50 C1120,20 1300,72 1440,55 L1440,80 L0,80 Z"
          fill={svgColor}
        />
      </svg>
    </div>
  );
};

export const Confetti: React.FC = () => {
  return <canvas id="confettiCanvas" className={styles.confettiCanvas}></canvas>;
};

export const HeartsAnimation: React.FC = () => {
  return (
    <div className={styles.heartsCorner}>
      <div className={styles.hf}>🍓</div>
      <div className={styles.hf}>❤️</div>
      <div className={styles.hf}>💕</div>
    </div>
  );
};

export const RainLayer: React.FC = () => {
  const rainEmojis = ['🍓', '🌸', '✨', '🎀', '💕', '🍓', '🍓', '🎈', '🌺', '🍓'];
  const [rainDrops, setRainDrops] = React.useState<Array<{
    left: number;
    duration: number;
    delay: number;
    fontSize: number;
  }> | null>(null);

  React.useEffect(() => {
    // Generate random values only on client side
    const drops = Array.from({ length: 24 }).map(() => ({
      left: Math.random() * 100,
      duration: 5 + Math.random() * 10,
      delay: Math.random() * 10,
      fontSize: 12 + Math.random() * 18,
    }));
    setRainDrops(drops);
  }, []);

  if (!rainDrops) {
    return <div className={styles.rainLayer} id="rainLayer" />;
  }

  return (
    <div className={styles.rainLayer} id="rainLayer">
      {rainDrops.map((drop, i) => (
        <div
          key={i}
          className={styles.drop}
          style={{
            left: `${drop.left}vw`,
            fontSize: `${drop.fontSize}px`,
            animationDuration: `${drop.duration}s`,
            animationDelay: `${drop.delay}s`,
          }}
        >
          {rainEmojis[i % rainEmojis.length]}
        </div>
      ))}
    </div>
  );
};
