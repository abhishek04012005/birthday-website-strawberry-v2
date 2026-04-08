import React, { useEffect, useState } from 'react';
import styles from '@/styles/About.module.css';

interface Fact {
  id: string;
  icon: string;
  label: string;
  number: string;
  unit: string;
  description: string;
  barWidth: number;
  colorClass: string;
}

interface PersonalityTag {
  text: string;
  emoji: string;
}

interface AboutProps {
  childName: string;
  childFullName: string;
  birthDate: string;
  age: number;
  photoUrl: string;
  facts: Fact[];
  personalityTags: PersonalityTag[];
}

export const About: React.FC<AboutProps> = ({
  childName,
  childFullName,
  birthDate,
  age,
  photoUrl,
  facts,
  personalityTags,
}) => {
  const [countersAnimated, setCountersAnimated] = useState(false);
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !countersAnimated) {
          animateCounters();
          setCountersAnimated(true);
        }
      },
      { threshold: 0.2 }
    );

    const section = document.getElementById('about');
    if (section) observer.observe(section);
    return () => observer.disconnect();
  }, [countersAnimated]);

  const animateCounters = () => {
    facts.forEach((fact) => {
      const target = parseInt(fact.number);
      const dur = 1800;
      const step = 16;
      const inc = target / (dur / step);
      let cur = 0;

      const t = setInterval(() => {
        cur = Math.min(cur + inc, target);
        setCounts((prev) => ({
          ...prev,
          [fact.id]: Math.floor(cur),
        }));
        if (cur >= target) clearInterval(t);
      }, step);
    });
  };

  return (
    <section className={styles.aboutSection} id="about">
      <div className={styles.secHead}>
        <div className={styles.secPill}>🍓 Meet the Birthday Girl</div>
        <h2 className={styles.secTitle}>All About {childName}!</h2>
        <p className={styles.secSub}>
          {age} years of pure magic, mischief & mountains of chocolate. Here are {childName}'s most important life stats 🎉
        </p>
      </div>

      <div className={styles.aboutLayout}>
        <div className={styles.portraitCol}>
          <div className={styles.portraitFrame}>
            <div className={`${styles.ps} ${styles.ps1}`}>🍓</div>
            <div className={`${styles.ps} ${styles.ps2}`}>🌸</div>
            <div className={`${styles.ps} ${styles.ps3}`}>✨</div>
            <div className={`${styles.ps} ${styles.ps4}`}>🎀</div>
            <img
              className={styles.portraitImg}
              src={photoUrl}
              alt={childName}
              onError={(e) => {
                e.currentTarget.src =
                  'https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?w=600&q=80&fit=crop&crop=faces,top';
              }}
            />
          </div>

          <div className={styles.nameTag}>
            <span className={styles.nameTagEmoji}>👸</span>
            <span className={styles.nameTagName}>{childFullName}</span>
            <span className={styles.nameTagSub}>🎂 Born {birthDate} · Age {age} 🎂</span>
          </div>
        </div>

        <div className={styles.factsGrid}>
          {facts.map((fact) => (
            <div key={fact.id} className={`${styles.factCard} ${styles[fact.colorClass]}`}>
              <div className={styles.factIconBubble}>{fact.icon}</div>
              <span className={styles.factLabel}>{fact.label}</span>
              <span className={styles.factNumber}>
                <span>{counts[fact.id] || 0}</span>
                <span className={styles.factUnit}>{fact.unit}</span>
              </span>
              <p className={styles.factDesc}>{fact.description}</p>
              <div className={styles.factBarWrap}>
                <div
                  className={styles.factBar}
                  style={{
                    width: countersAnimated ? `${fact.barWidth}%` : '0%',
                  }}
                ></div>
              </div>
            </div>
          ))}

          <div className={styles.personalityRow}>
            <div className={styles.personalityTitle}>✨ {childName}'s Personality in Tags</div>
            <div className={styles.tagsRow}>
              {personalityTags.map((tag, idx) => (
                <span key={idx} className={`${styles.ptag} ${styles[`pt${(idx % 8) + 1}`]}`}>
                  {tag.text}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.confettiButton}>
            <button
              className={styles.btnConfetti}
              onClick={() => {
                const canvas = document.getElementById('confettiCanvas') as HTMLCanvasElement;
                if (canvas) {
                  // Stop any existing animation
                  if ((canvas as any).__confettiCleanup) {
                    (canvas as any).__confettiCleanup();
                  }
                  // Start new infinite confetti
                  (canvas as any).__confettiCleanup = launchConfetti(canvas);
                }
              }}
            >
              🎉 Celebrate with Confetti! 🎉
            </button>
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
