'use client';

import React, { useEffect, useState } from 'react';
import config from '@/data/config.json';
import { Navbar } from '@/components/Navbar';
import { Quiz, QuizQuestion } from '@/components/Quiz';
import { Footer } from '@/components/Footer';
import { Wave } from '@/components/Utils';
import styles from '@/styles/SectionPage.module.css';

export default function QuizPage() {
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);

  useEffect(() => {
    const savedQuiz = localStorage.getItem('birthdayQuizQuestions');
    if (savedQuiz) {
      try {
        const parsed = JSON.parse(savedQuiz) as QuizQuestion[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setQuizQuestions(parsed);
          return;
        }
      } catch {
        // ignore parse failure
      }
    }
    setQuizQuestions(config.quiz as QuizQuestion[]);
  }, []);

  return (
    <main className={styles.pageWrapper}>
      <Navbar childName={config.child.name} />

      <section className={styles.pageHero}>
        <div className={styles.pageHeroBody}>
          <p className={styles.pageEyebrow}>Birthday Quiz</p>
          <h1 className={styles.pageTitle}>Play {config.child.name}’s Quiz</h1>
          <p className={styles.pageCopy}>
            Answer the party questions and see how well you know our birthday girl.
          </p>
        </div>
      </section>

      <Quiz questions={quizQuestions} />

      <Wave bgColor="#fff8f2" svgColor="#fff0f4" />
      <Footer childName={config.child.name} date={config.party.date} venue={config.party.venue} />
    </main>
  );
}
