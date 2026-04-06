import React from 'react';
import styles from '@/styles/Treats.module.css';

interface Treat {
  emoji: string;
  name: string;
  description: string;
  image: string;
  tag: string;
}

interface TreatsProps {
  treats: Treat[];
  childName: string;
}

export const Treats: React.FC<TreatsProps> = ({ treats, childName }) => {
  return (
    <section className={styles.treatsBg} id="treats">
      <div className={styles.secHead}>
        <div className={styles.secPill}>🍰 Sweet Treats</div>
        <h2 className={styles.secTitle}>Party Menu 🍓</h2>
        <p className={styles.secSub}>
          A delicious spread of {childName}'s absolute favourite treats — because every birthday needs the sweetest food!
        </p>
      </div>

      <div className={styles.treatsGrid}>
        {treats.map((treat, idx) => (
          <div key={idx} className={styles.treatCard}>
            <div className={styles.treatImgWrap}>
              <img
                className={styles.treatImg}
                src={treat.image}
                alt={treat.name}
                onError={(e) => {
                  e.currentTarget.src= 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=85&fit=crop';
                }}
              />
              <div className={styles.treatTag}>{treat.tag}</div>
            </div>
            <div className={styles.treatBody}>
              <span className={styles.treatEmoji}>{treat.emoji}</span>
              <div className={styles.treatName}>{treat.name}</div>
              <p className={styles.treatDesc}>{treat.description}</p>
              <div className={styles.treatRating}>
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <span key={i}>🍓</span>
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
