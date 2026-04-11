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
              if (canvas) {
                // Stop any existing animation
                if ((canvas as any).__confettiCleanup) {
                  (canvas as any).__confettiCleanup();
                }
                // Start new infinite confetti
                (canvas as any).__confettiCleanup = launchConfetti(canvas);
              }
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
  let animationId: number;
  let lastTime = 0;

  // Create initial particles
  for (let i = 0; i < 150; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 3 + Math.random() * 8,
      c: CC[Math.floor(Math.random() * CC.length)],
      s: CS[Math.floor(Math.random() * CS.length)],
      vx: (Math.random() - 0.5) * 2,
      vy: 1 + Math.random() * 3,
      rot: Math.random() * 360,
      rv: (Math.random() - 0.5) * 2,
      a: 0.8 + Math.random() * 0.2,
      life: 0,
      maxLife: 300 + Math.random() * 200,
    });
  }

  function addNewParticles() {
    // Add 2-5 new particles at random positions at the top
    const numNew = 2 + Math.floor(Math.random() * 4);
    for (let i = 0; i < numNew; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 50,
        r: 3 + Math.random() * 8,
        c: CC[Math.floor(Math.random() * CC.length)],
        s: CS[Math.floor(Math.random() * CS.length)],
        vx: (Math.random() - 0.5) * 2,
        vy: 1 + Math.random() * 3,
        rot: Math.random() * 360,
        rv: (Math.random() - 0.5) * 2,
        a: 0.8 + Math.random() * 0.2,
        life: 0,
        maxLife: 300 + Math.random() * 200,
      });
    }
  }

  function draw(currentTime: number) {
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    cx.clearRect(0, 0, canvas.width, canvas.height);

    // Add new particles periodically
    if (Math.random() < 0.3) {
      addNewParticles();
    }

    // Update and draw particles
    particles = particles.filter((p) => {
      // Update particle properties with smooth linear motion
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.rv;
      p.life += deltaTime;

      // Fade out particles near the bottom or when life expires
      if (p.y > canvas.height - 100 || p.life > p.maxLife) {
        p.a = Math.max(0, p.a - 0.005);
      }

      // Remove particles that are completely faded
      if (p.a <= 0.01) {
        return false;
      }

      // Wrap particles around screen edges for infinite effect
      if (p.x < -p.r) p.x = canvas.width + p.r;
      if (p.x > canvas.width + p.r) p.x = -p.r;
      if (p.y > canvas.height + p.r) {
        // Reset particle to top when it goes off bottom
        p.y = -p.r;
        p.x = Math.random() * canvas.width;
        p.life = 0;
        p.a = 0.8 + Math.random() * 0.2;
      }

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

      return true;
    });

    // Keep the animation running infinitely
    animationId = requestAnimationFrame(draw);
  }

  // Start the animation
  animationId = requestAnimationFrame(draw);

  // Return cleanup function
  return () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  };
}
