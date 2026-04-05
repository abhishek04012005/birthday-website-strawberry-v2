'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import config from '@/data/config.json';
import styles from '@/styles/QuizSettings.module.css';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
}

const STORAGE_KEY = 'birthdayQuizQuestions';

export default function QuizSettingsClient() {
  const router = useRouter();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const sessionStr = localStorage.getItem('adminSession');
    if (!sessionStr) {
      router.push('/auth');
      return;
    }

    try {
      const session = JSON.parse(sessionStr);
      if (!session?.expiresAt || session.expiresAt < Date.now()) {
        localStorage.removeItem('adminSession');
        router.push('/auth');
        return;
      }
    } catch {
      localStorage.removeItem('adminSession');
      router.push('/auth');
      return;
    }

    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData) as QuizQuestion[];
        if (Array.isArray(parsed)) {
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

    setLoading(false);
  }, [router]);

  const handleQuestionChange = (index: number, field: keyof QuizQuestion, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    const updated = [...questions];
    const options = [...updated[questionIndex].options];
    options[optionIndex] = value;
    updated[questionIndex] = { ...updated[questionIndex], options };
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: Date.now(),
        question: '',
        options: ['', '', '', ''],
        correctIndex: 0,
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const resetDefaults = () => {
    setQuestions(config.quiz as QuizQuestion[]);
    setMessage({ text: 'Default quiz questions restored.', type: 'success' });
  };

  const saveSettings = () => {
    try {
      setSaving(true);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
      setMessage({ text: 'Quiz settings saved successfully.', type: 'success' });
    } catch {
      setMessage({ text: 'Unable to save quiz settings. Please try again.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading quiz settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Quiz Settings</h1>
          <p>Edit the birthday quiz questions that appear on the public site.</p>
        </div>
        <div className={styles.headerActions}>
          <button type="button" className={styles.secondaryBtn} onClick={resetDefaults}>
            Reset Defaults
          </button>
          <button type="button" className={styles.primaryBtn} onClick={saveSettings} disabled={saving}>
            {saving ? 'Saving…' : 'Save Settings'}
          </button>
        </div>
      </div>

      {message && (
        <div className={`${styles.alert} ${message.type === 'success' ? styles.success : styles.error}`}>
          {message.text}
        </div>
      )}

      <div className={styles.questionGrid}>
        {questions.map((question, index) => (
          <section key={question.id} className={styles.questionCard}>
            <div className={styles.questionCardHeader}>
              <h2>Question {index + 1}</h2>
              <button type="button" className={styles.removeBtn} onClick={() => removeQuestion(index)}>
                Remove
              </button>
            </div>

            <label className={styles.fieldLabel} htmlFor={`question-${question.id}`}>
              Question
            </label>
            <input
              id={`question-${question.id}`}
              type="text"
              value={question.question}
              onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
              className={styles.textInput}
              placeholder="Enter the quiz question"
            />

            <div className={styles.optionsBlock}>
              <span className={styles.fieldLabel}>Options</span>
              {question.options.map((option, optionIndex) => (
                <label key={optionIndex} className={styles.optionRow}>
                  <input
                    type="radio"
                    name={`correct-${question.id}`}
                    checked={question.correctIndex === optionIndex}
                    onChange={() => handleQuestionChange(index, 'correctIndex', optionIndex)}
                  />
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                    className={styles.textInput}
                    placeholder={`Option ${optionIndex + 1}`}
                  />
                </label>
              ))}
            </div>
          </section>
        ))}
      </div>

      <button type="button" className={styles.addQuestionBtn} onClick={addQuestion}>
        + Add another question
      </button>
    </div>
  );
}
