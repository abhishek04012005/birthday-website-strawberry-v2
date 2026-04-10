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
  const [activeTab, setActiveTab] = useState<'participants' | 'questions' | 'settings'>('participants');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
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
    setTimeout(() => setMessage(null), 3000);
  };

  const saveSettings = () => {
    try {
      setSaving(true);
      localStorage.setItem('birthdayQuizQuestions', JSON.stringify(questions));
      setMessage({ text: 'Quiz settings saved successfully.', type: 'success' });
      setTimeout(() => setMessage(null), 3000);
    } catch {
      setMessage({ text: 'Unable to save quiz settings. Please try again.', type: 'error' });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setSaving(false);
    }
  };

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
        {activeTab === 'settings' && (
          <div className={styles.headerActions}>
            <button type="button" className={styles.secondaryBtn} onClick={resetDefaults}>
              Reset Defaults
            </button>
            <button type="button" className={styles.primaryBtn} onClick={saveSettings} disabled={saving}>
              {saving ? 'Saving…' : 'Save Settings'}
            </button>
          </div>
        )}
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

      <div className={styles.tabs}>
        <button
          className={`${styles.tabBtn} ${activeTab === 'participants' ? styles.active : ''}`}
          onClick={() => setActiveTab('participants')}
        >
          👥 Quiz Participants ({results.length})
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'questions' ? styles.active : ''}`}
          onClick={() => setActiveTab('questions')}
        >
          Quiz Questions ({questions.length})
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'settings' ? styles.active : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ Quiz Settings
        </button>
      </div>

      {message && (
        <div className={`${styles.alert} ${message.type === 'success' ? styles.success : styles.error}`}>
          {message.text}
        </div>
      )}

      {activeTab === 'participants' && (
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
      )}

      {activeTab === 'questions' && (
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
      )}

      {activeTab === 'settings' && (
        <section className={styles.settingsSection}>
          <div className={styles.sectionHeader}>
            <h2>Edit Quiz Questions</h2>
            <p>Add, edit, or remove questions from the birthday quiz.</p>
          </div>

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
        </section>
      )}
    </div>
  );
}
