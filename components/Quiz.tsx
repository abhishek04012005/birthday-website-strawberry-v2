'use client';

import React, { useEffect, useMemo, useState } from 'react';
import styles from '@/styles/Quiz.module.css';

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface QuizResult {
  id: string;
  name: string;
  phone: string;
  score: number;
  total: number;
  completedAt: string;
}

interface QuizProps {
  questions: QuizQuestion[];
}

export const Quiz: React.FC<QuizProps> = ({ questions }) => {
  const [answers, setAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showValidationMessage, setShowValidationMessage] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showNamePopup, setShowNamePopup] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    setAnswers(questions.map(() => -1));
    setSubmitted(false);
    setScore(0);
    setCurrentQuestion(0);
    setShowValidationMessage(false);
  }, [questions]);

  const currentQuestionObject = questions[currentQuestion];

  const total = questions.length;
  const correctAnswerCount = useMemo(() => score, [score]);

  const saveQuizResult = (result: QuizResult) => {
    try {
      const existing = localStorage.getItem('birthdayQuizResults');
      const parsed: QuizResult[] = existing ? JSON.parse(existing) : [];
      parsed.unshift(result);
      localStorage.setItem('birthdayQuizResults', JSON.stringify(parsed));
    } catch {
      // Ignore localStorage failures.
    }
  };

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

    saveQuizResult({
      id: `${guestName.trim().replace(/\s+/g, '_')}_${Date.now()}`,
      name: guestName.trim(),
      phone: phone.trim(),
      score: newScore,
      total,
      completedAt: new Date().toISOString(),
    });
  };

  const handleReset = () => {
    setAnswers(questions.map(() => -1));
    setSubmitted(false);
    setScore(0);
    setShowValidationMessage(false);
  };

  const handleStartQuiz = () => {
    if (!guestName.trim() || !phone.trim()) return;
    setShowNamePopup(false);
    setShowPopup(true);
  };

  const handleNextQuestion = () => {
    setShowValidationMessage(false);
    if (currentQuestion < total - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
      setShowValidationMessage(false);
    }
  };

  const handleDownloadScore = () => {
    const width = 900;
    const height = 500;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#fff7f9';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#8c001a';
    ctx.fillRect(0, 0, width, 130);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 40px Inter, system-ui, sans-serif';
    ctx.fillText('Quiz Score', 40, 80);

    ctx.fillStyle = '#4f151f';
    ctx.font = '24px Inter, system-ui, sans-serif';
    ctx.fillText(`Name: ${guestName}`, 40, 180);
    ctx.fillText(`Phone: ${phone}`, 40, 230);
    ctx.fillText(`Score: ${score} / ${total}`, 40, 280);
    ctx.fillText(`Completed: ${new Date().toLocaleString()}`, 40, 330);

    ctx.strokeStyle = '#8c001a';
    ctx.lineWidth = 2;
    ctx.strokeRect(30, 150, width - 60, 220);

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `${guestName.replace(/\s+/g, '_')}_quiz_score.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    <>
      <section className={styles.quizSection} id="quiz">
        <h2>🎮 Birthday Quiz</h2>
        <p>Test your party knowledge! There are {total} questions.</p>
        
        <div className={styles.startQuizContainer}>
          <button 
            className={styles.startQuizBtn}
            onClick={() => setShowNamePopup(true)}
          >
            🎯 Take a Quiz
          </button>
        </div>
      </section>

      {/* Name Collection Popup */}
      {showNamePopup && (
        <div className={styles.popupOverlay} onClick={() => setShowNamePopup(false)}>
          <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
            <button className={styles.popupClose} onClick={() => setShowNamePopup(false)}>✕</button>
            <div className={styles.popupContent}>
              <div className={styles.popupIcon}>🎮</div>
              <h3>Ready to Test Your Knowledge?</h3>
              <p>Please enter your name and phone number to start the quiz.</p>

              <div className={styles.formGroup}>
                <label htmlFor="guestName">Your Name:</label>
                <input
                  id="guestName"
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phone">Phone Number:</label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div className={styles.popupActions}>
                <button className={styles.cancelBtn} onClick={() => setShowNamePopup(false)}>
                  Cancel
                </button>
                <button 
                  className={styles.startBtn} 
                  onClick={handleStartQuiz}
                  disabled={!guestName.trim() || !phone.trim()}
                >
                  Start Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Popup */}
      {showPopup && (
        <div className={styles.popupOverlay} onClick={() => setShowPopup(false)}>
          <div className={styles.quizPopup} onClick={(e) => e.stopPropagation()}>
            <button className={styles.popupClose} onClick={() => setShowPopup(false)}>✕</button>
            <div className={styles.quizPopupContent}>
              <div className={styles.popupIcon}>🎮</div>
              <h3>Welcome {guestName}!</h3>
              <p>Test your party knowledge! There are {total} questions.</p>

              <div className={styles.quizProgress}>
                Question {currentQuestion + 1} of {total}
              </div>

              <div className={styles.quizCard}>
                <div className={styles.questionText}>
                  {currentQuestion + 1}. {currentQuestionObject.question}
                </div>

                <div className={styles.optionList}>
                  {currentQuestionObject.options.map((option, optionIndex) => {
                    const selected = answers[currentQuestion] === optionIndex;
                    const correct = submitted && currentQuestionObject.correctIndex === optionIndex;
                    const wrong = submitted && selected && currentQuestionObject.correctIndex !== optionIndex;

                    return (
                      <button
                        key={optionIndex}
                        className={`${styles.optionBtn} ${selected ? styles.selectedOption : ''} ${correct ? styles.correctOption : ''} ${wrong ? styles.wrongOption : ''}`}
                        aria-pressed={selected}
                        disabled={submitted}
                        onClick={() => handleSelect(currentQuestion, optionIndex)}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>

                {submitted && (
                  <p className={styles.explanationText}>
                    Correct answer: {currentQuestionObject.options[currentQuestionObject.correctIndex]}
                  </p>
                )}
              </div>

              {showValidationMessage && <p className={styles.validationText}>Please answer the current question before moving on.</p>}

              <div className={styles.quizActions}>
                <button
                  className={styles.prevBtn}
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestion === 0 || submitted}
                >
                  Previous
                </button>

                {currentQuestion < total - 1 ? (
                  <button
                    className={styles.nextBtn}
                    onClick={handleNextQuestion}
                    disabled={answers[currentQuestion] === -1 || submitted}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    className={styles.submitBtn}
                    onClick={handleSubmit}
                    disabled={submitted || answers[currentQuestion] === -1}
                  >
                    {submitted ? 'Submitted' : 'Submit Quiz'}
                  </button>
                )}

                <button className={styles.resetBtn} onClick={handleReset}>
                  Reset Quiz
                </button>
              </div>

              {submitted && (
                <div className={styles.scoreBox}>
                  <strong>Score: {correctAnswerCount} / {total}</strong>
                  <p>Great job, {guestName}! Keep the party spirit alive 🎉</p>

                  <div className={styles.saveActions}>
                    <button 
                      className={styles.downloadBtn}
                      onClick={handleDownloadScore}
                    >
                      📥 Download Score
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
