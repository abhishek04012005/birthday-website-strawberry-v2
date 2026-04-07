'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import config from '@/data/config.json';
import styles from '@/styles/QuizDashboard.module.css';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
}

interface QuizResult {
  id: string;
  name: string;
  phone: string;
  score: number;
  total: number;
  completedAt: string;
}

export default function QuizDashboardClient() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loaded, setLoaded] = useState(false);
  const total = questions.length;

  useEffect(() => {
    const savedQuiz = localStorage.getItem('birthdayQuizQuestions');
    if (savedQuiz) {
      try {
        const parsed = JSON.parse(savedQuiz) as QuizQuestion[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setQuestions(parsed);
        } else {
          setQuestions(config.quiz as QuizQuestion[]);
        }
      } catch {
        setQuestions(config.quiz as QuizQuestion[]);
      }
    } else {
      setQuestions(config.quiz as QuizQuestion[]);
    }

    const savedResults = localStorage.getItem('birthdayQuizResults');
    if (savedResults) {
      try {
        const parsedResults = JSON.parse(savedResults) as QuizResult[];
        if (Array.isArray(parsedResults)) {
          setResults(parsedResults);
        }
      } catch {
        setResults([]);
      }
    }

    setLoaded(true);
  }, []);

  if (!loaded) {
    return <div className={styles.loading}>Loading quiz dashboard...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Quiz Dashboard</h1>
          <p>Review the current quiz content and quick metrics for the birthday quiz.</p>
        </div>
        <Link href="/admin/quiz-settings" className={styles.primaryBtn}>
          Manage Quiz Questions
        </Link>
      </div>

      <div className={styles.statsGrid}>
        <article className={styles.statCard}>
          <span className={styles.statLabel}>Total Questions</span>
          <strong>{questions.length}</strong>
        </article>
        <article className={styles.statCard}>
          <span className={styles.statLabel}>Quiz Participants</span>
          <strong>{results.length}</strong>
        </article>
        <article className={styles.statCard}>
          <span className={styles.statLabel}>Average Score</span>
          <strong>
            {results.length > 0
              ? `${Math.round(results.reduce((sum, entry) => sum + entry.score, 0) / results.length)} / ${total}`
              : `- / ${total}`}
          </strong>
        </article>
      </div>

      <section className={styles.questionSection}>
        <div className={styles.sectionHeader}>
          <h2>Quiz Questions</h2>
          <p>These are the questions currently available in the public birthday quiz.</p>
        </div>

        <div className={styles.questionList}>
          {questions.map((question, index) => (
            <div key={question.id} className={styles.questionItem}>
              <div className={styles.questionIndex}>#{index + 1}</div>
              <div>
                <h3>{question.question}</h3>
                <div className={styles.optionRow}>
                  {question.options.map((option, optionIndex) => (
                    <span
                      key={optionIndex}
                      className={
                        optionIndex === question.correctIndex
                          ? styles.correctOptionLabel
                          : styles.optionLabel
                      }
                    >
                      {option}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.resultsSection}>
        <div className={styles.sectionHeader}>
          <h2>Quiz Participants</h2>
          <p>Who has taken the quiz and what score they achieved.</p>
        </div>

        {results.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No quiz participants have completed the quiz yet.</p>
          </div>
        ) : (
          <div className={styles.resultsTableWrapper}>
            <table className={styles.resultsTable}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Score</th>
                  <th>Completed</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr key={result.id}>
                    <td>{index + 1}</td>
                    <td>{result.name}</td>
                    <td>{result.phone}</td>
                    <td>{result.score} / {result.total}</td>
                    <td>{new Date(result.completedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
