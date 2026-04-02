'use client';

import React, { useEffect, useMemo, useState } from 'react';
import styles from '@/styles/Quiz.module.css';

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
}

interface QuizProps {
  questions: QuizQuestion[];
}

export const Quiz: React.FC<QuizProps> = ({ questions }) => {
  const [answers, setAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number>(0);
  const [showValidationMessage, setShowValidationMessage] = useState(false);

  useEffect(() => {
    setAnswers(questions.map(() => -1));
    setSubmitted(false);
    setScore(0);
    setShowValidationMessage(false);
  }, [questions]);

  const total = questions.length;
  const correctAnswerCount = useMemo(() => score, [score]);

  const handleSelect = (qIndex: number, optionIndex: number) => {
    if (submitted) return;
    setAnswers((prev) => {
      const next = [...prev];
      next[qIndex] = optionIndex;
      return next;
    });
  };

  const handleSubmit = () => {
    if (answers.some((value) => value === -1)) {
      setShowValidationMessage(true);
      return;
    }

    const newScore = answers.reduce((acc, value, index) => {
      if (value === questions[index].correctIndex) {
        return acc + 1;
      }
      return acc;
    }, 0);

    setScore(newScore);
    setSubmitted(true);
    setShowValidationMessage(false);
  };

  const handleReset = () => {
    setAnswers(questions.map(() => -1));
    setSubmitted(false);
    setScore(0);
    setShowValidationMessage(false);
  };

  if (questions.length === 0) {
    return (
      <section className={styles.quizSection}>
        <h2>🎮 Quiz</h2>
        <p>No quiz available right now. Please ask admin to add questions.</p>
      </section>
    );
  }

  return (
    <section className={styles.quizSection} id="quiz">
      <h2>🎮 Birthday Quiz</h2>
      <p>Test your party knowledge! There are {total} questions.</p>

      {questions.map((question, qIndex) => (
        <div key={question.id} className={styles.quizCard}>
          <div className={styles.questionText}>
            {qIndex + 1}. {question.question}
          </div>

          <div className={styles.optionList}>
            {question.options.map((option, optionIndex) => {
              const selected = answers[qIndex] === optionIndex;
              const correct = submitted && question.correctIndex === optionIndex;
              const wrong = submitted && selected && question.correctIndex !== optionIndex;

              return (
                <button
                  key={optionIndex}
                  className={`${styles.optionBtn} ${selected ? styles.selectedOption : ''} ${correct ? styles.correctOption : ''} ${wrong ? styles.wrongOption : ''}`}
                  aria-pressed={selected}
                  disabled={submitted}
                  onClick={() => handleSelect(qIndex, optionIndex)}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {submitted && (
            <p className={styles.explanationText}>
              Correct answer: {question.options[question.correctIndex]}
            </p>
          )}
        </div>
      ))}

      {showValidationMessage && <p className={styles.validationText}>Please answer all questions before submitting.</p>}

      <div className={styles.quizActions}>
        <button className={styles.submitBtn} onClick={handleSubmit} disabled={submitted}>
          {submitted ? 'Submitted' : 'Submit Quiz'}
        </button>
        <button className={styles.resetBtn} onClick={handleReset}>
          Reset Quiz
        </button>
      </div>

      {submitted && (
        <div className={styles.scoreBox}>
          <strong>Score: {correctAnswerCount} / {total}</strong>
          <p>Great job! Keep the party spirit alive 🎉</p>
        </div>
      )}
    </section>
  );
};
