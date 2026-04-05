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

interface ParentsProps {
  title: string;
  subtitle: string;
  list: Parent[];
}

export const Parents: React.FC<ParentsProps> = ({ title, subtitle, list }) => {
  return (
    <section id="parents" className={styles.parentsSection}>
      <div className={styles.parentsContainer}>
        <div className={styles.parentsHeader}>
          <h2 className={styles.parentsTitle}>{title}</h2>
          <p className={styles.parentsSubtitle}>{subtitle}</p>
        </div>

        <div className={styles.familyTree}>
          <div className={styles.treeLevel}>
            {list.map((parent, index) => (
              <div key={index} className={styles.treeNode}>
                <div className={styles.parentImageWrapper}>
                  <img
                    src={parent.image}
                    alt={parent.name}
                    className={styles.parentImage}
                  />
                  <div className={styles.parentEmoji}>{parent.emoji}</div>
                </div>
                <div className={styles.parentContent}>
                  <h3 className={styles.parentName}>{parent.name}</h3>
                  <p className={styles.parentRelationship}>{parent.relationship}</p>
                  <p className={styles.parentDescription}>{parent.description}</p>
                  <p className={styles.parentHobbies}>
                    <strong>Hobbies:</strong> {parent.hobbies}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.connectorRow}>
            <span className={styles.connectorLine} />
            <div className={styles.familyHub}>
              <span className={styles.hubLabel}>Family Network</span>
            </div>
            <span className={styles.connectorLine} />
          </div>
        </div>

        <div className={styles.familyNote}>
          <p>💕 Emma is so grateful for her loving & supportive family. The best gift is having them celebrate with her! 💕</p>
        </div>
      </div>
    </section>
  );
};
