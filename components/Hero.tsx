import React, { useEffect, useState } from 'react';
import styles from '@/styles/Hero.module.css';

interface HeroProps {
  childName: string;
  childFullName: string;
  age: number;
  heroData: {
    subtitle: string;
    cta1: string;
    cta2: string;
    photoUrl: string;
    photoAlt: string;
  };
  partyDate: string;
}

export const Hero: React.FC<HeroProps> = ({
  childFullName,
  age,
  heroData,
  partyDate,
}) => {
  const [countdown, setCountdown] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  });

  useEffect(() => {
    const tick = () => {
      // Calculate 7 days from today at 3 PM
      const today = new Date();
      const partyDateObj = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      partyDateObj.setHours(15, 0, 0, 0);

      const party = partyDateObj.getTime();
      const now = new Date().getTime();
      const diff = party - now;

      if (diff <= 0) {
        setCountdown({ days: '00', hours: '00', minutes: '00', seconds: '00' });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown({
        days: String(days).padStart(2, '0'),
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0'),
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [partyDate]);

  return (
    <section className={styles.hero} id="hero">
      <div className={styles.heroBg}></div>
      <div className={`${styles.blob} ${styles.b1}`}></div>
      <div className={`${styles.blob} ${styles.b2}`}></div>
      <div className={`${styles.blob} ${styles.b3}`}></div>
      <div className={styles.heroDecoSb}>🍓</div>

      <div className={styles.heroInner}>
        <div>
          <div className={styles.heroEyebrow}>🍓 You&apos;re Invited 🍓</div>
          <h1 className={styles.heroTitle}>Happy Birthday,</h1>
          <div className={styles.heroName}>{childFullName}!</div>
          <div className={styles.heroAgeBadge}>🎂 Turning {age} Years Old! 🎂</div>
          <p className={styles.heroSub} dangerouslySetInnerHTML={{ __html: heroData.subtitle }} />
          <div className={styles.heroBtns}>
            <a href="#rsvp" className={styles.btnRed}>{heroData.cta1}</a>
            <button className={styles.btnGhost} onClick={() => {
              const canvas = document.getElementById('confettiCanvas') as HTMLCanvasElement;
              if (canvas) launchConfetti(canvas);
            }}>
              {heroData.cta2}
            </button>
          </div>
        </div>

        <div className={styles.heroRight}>
          <div className={styles.photoWrapper}>
            <div className={styles.photoRing}></div>
            <div className={`${styles.sticker} ${styles.s1}`}>🍓</div>
            <div className={`${styles.sticker} ${styles.s2}`}>🌸</div>
            <div className={`${styles.sticker} ${styles.s3}`}>✨</div>
            <div className={`${styles.sticker} ${styles.s4}`}>🎀</div>
            <div className={`${styles.sticker} ${styles.s5}`}>🎈</div>
            <div className={styles.photoFrame}>
              <img
                src={heroData.photoUrl}
                alt={heroData.photoAlt}
                onError={(e) => {
                  e.currentTarget.src =
                    'https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?w=600&q=85&fit=crop&crop=faces,top';
                }}
              />
            </div>
          </div>

          <div className={styles.countdownCard}>
            <div className={styles.cdTitle}>🎂 Counting Down to the Big Day! 🎂</div>
            <div className={styles.cdRow}>
              <div className={styles.cdBox}>
                <span className={styles.cdNum}>{countdown.days}</span>
                <span className={styles.cdLabel}>Days</span>
              </div>
              <div className={styles.cdColon}>:</div>
              <div className={styles.cdBox}>
                <span className={styles.cdNum}>{countdown.hours}</span>
                <span className={styles.cdLabel}>Hours</span>
              </div>
              <div className={styles.cdColon}>:</div>
              <div className={styles.cdBox}>
                <span className={styles.cdNum}>{countdown.minutes}</span>
                <span className={styles.cdLabel}>Mins</span>
              </div>
              <div className={styles.cdColon}>:</div>
              <div className={styles.cdBox}>
                <span className={styles.cdNum}>{countdown.seconds}</span>
                <span className={styles.cdLabel}>Secs</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Confetti animation function
function launchConfetti(canvas: HTMLCanvasElement) {
  const cx = canvas.getContext('2d');
  if (!cx) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const CC = ['#e8243c', '#ffb3c1', '#ffe566', '#3da84c', '#fff', '#ff6b8a', '#8c001a', '#c77dff', '#00b4d8'];
  const CS = ['circle', 'rect', 'tri'];
  let particles: any[] = [];

  for (let i = 0; i < 240; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: -22,
      r: 5 + Math.random() * 10,
      c: CC[Math.floor(Math.random() * CC.length)],
      s: CS[Math.floor(Math.random() * CS.length)],
      vx: (Math.random() - 0.5) * 8,
      vy: 2 + Math.random() * 6,
      rot: Math.random() * 360,
      rv: (Math.random() - 0.5) * 10,
      a: 1,
    });
  }

  function draw() {
    cx.clearRect(0, 0, canvas.width, canvas.height);
    particles = particles.filter((p) => p.a > 0.01);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.14;
      p.rot += p.rv;
      if (p.y > canvas.height - 50) p.a -= 0.024;

      cx.save();
      cx.globalAlpha = p.a;
      cx.translate(p.x, p.y);
      cx.rotate((p.rot * Math.PI) / 180);
      cx.fillStyle = p.c;

      if (p.s === 'circle') {
        cx.beginPath();
        cx.arc(0, 0, p.r, 0, Math.PI * 2);
        cx.fill();
      } else if (p.s === 'rect') {
        cx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
      } else {
        cx.beginPath();
        cx.moveTo(0, -p.r);
        cx.lineTo(p.r, p.r);
        cx.lineTo(-p.r, p.r);
        cx.closePath();
        cx.fill();
      }
      cx.restore();
    }

    if (particles.length > 0) requestAnimationFrame(draw);
    else cx.clearRect(0, 0, canvas.width, canvas.height);
  }

  draw();
}
