'use client';

import React from 'react';
import styles from '@/styles/Parents.module.css';

interface Parent {
  name: string;
  relationship: string;
  emoji: string;
  description: string;
  hobbies: string;
  image: string;
}

interface ParentsData {
  title: string;
  subtitle: string;
  list: Parent[];
}

interface ParentsProps {
  parents: ParentsData;
  childName: string;
}

export const Parents: React.FC<ParentsProps> = ({ parents, childName }) => {
  return (
    <section id="parents" className={styles.parentsSection}>
      <div className={styles.parentsContainer}>
        <div className={styles.parentsHeader}>
          <h2 className={styles.parentsTitle}>{parents.title}</h2>
          <p className={styles.parentsSubtitle}>{parents.subtitle}</p>
        </div>

        <div className={styles.timeline}>
          <div className={styles.timelineCenter} />
          
          {parents.list.map((parent, index) => (
            <div 
              key={index} 
              className={`${styles.timelineItem} ${index % 2 === 0 ? styles.left : styles.right}`}
            >
              <div className={styles.timelineMarker}>
                <div className={styles.timelineCircle}>
                  <span className={styles.markerEmoji}>{parent.emoji}</span>
                </div>
                <div className={styles.timelineConnector} />
              </div>

              <div className={styles.timelineContent}>
                <div className={styles.timelineCard}>
                  <div className={styles.cardImageWrapper}>
                    <img
                      src={parent.image}
                      alt={parent.name}
                      className={styles.cardImage}
                    />
                  </div>
                  <div className={styles.cardLabel}>{parent.relationship}</div>
                  <div className={styles.cardBody}>
                    <h3 className={styles.cardName}>{parent.name}</h3>
                    <p className={styles.cardDescription}>{parent.description}</p>
                    <p className={styles.cardHobbies}>
                      <strong>💡 Hobbies:</strong><br/>
                      {parent.hobbies}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.familyNote}>
          <p>💕 {childName} is so grateful for her loving & supportive family. The best gift is having them celebrate with her! 💕</p>
        </div>
      </div>
    </section>
  );
};
