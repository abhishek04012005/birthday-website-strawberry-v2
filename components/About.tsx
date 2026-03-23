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
        </div>
      </div>
    </section>
  );
};
