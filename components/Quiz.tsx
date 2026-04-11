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
    const width = 1000;
    const height = 600;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#ff6b9d');
    gradient.addColorStop(0.5, '#c44569');
    gradient.addColorStop(1, '#8c001a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add decorative border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 8;
    ctx.strokeRect(20, 20, width - 40, height - 40);

    // Inner white background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillRect(40, 40, width - 80, height - 80);

    // Header section with party theme
    ctx.fillStyle = '#8c001a';
    ctx.fillRect(40, 40, width - 80, 120);

    // Header text with shadow
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🎉 QUIZ SCORE CARD 🎉', width / 2, 100);

    // Subtitle
    ctx.fillStyle = '#4f151f';
    ctx.font = '24px Inter, system-ui, sans-serif';
    ctx.fillText('Birthday Party Knowledge Test', width / 2, 130);

    // Score circle in center
    const centerX = width / 2;
    const centerY = 280;
    const radius = 80;

    // Score circle background
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = score === total ? '#4CAF50' : score >= total * 0.7 ? '#FF9800' : '#f44336';
    ctx.fill();

    // Score circle border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Score text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 42px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${score}/${total}`, centerX, centerY + 15);

    // Score label
    ctx.font = '18px Inter, system-ui, sans-serif';
    ctx.fillText('SCORE', centerX, centerY + 35);

    // Participant details section
    ctx.fillStyle = '#8c001a';
    ctx.font = 'bold 28px Inter, system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('PARTICIPANT DETAILS', 80, 400);

    // Details background
    ctx.fillStyle = 'rgba(140, 0, 26, 0.1)';
    ctx.fillRect(70, 420, width - 140, 120);

    // Details text
    ctx.fillStyle = '#333333';
    ctx.font = '22px Inter, system-ui, sans-serif';
    ctx.fillText(`👤 Name: ${guestName}`, 100, 450);
    ctx.fillText(`📱 Phone: ${phone}`, 100, 480);
    ctx.fillText(`📅 Completed: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 100, 510);

    // Performance message
    let performanceMessage = '';
    let performanceColor = '#333333';
    const percentage = (score / total) * 100;

    if (percentage === 100) {
      performanceMessage = '🎯 PERFECT SCORE! You\'re a party expert!';
      performanceColor = '#4CAF50';
    } else if (percentage >= 80) {
      performanceMessage = '🌟 Excellent! You know the birthday star well!';
      performanceColor = '#FF9800';
    } else if (percentage >= 60) {
      performanceMessage = '👍 Good job! Keep celebrating!';
      performanceColor = '#2196F3';
    } else {
      performanceMessage = '🎉 Thanks for participating! Every guest is special!';
      performanceColor = '#9C27B0';
    }

    ctx.fillStyle = performanceColor;
    ctx.font = 'bold 20px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(performanceMessage, width / 2, 550);

    // Footer decoration
    ctx.fillStyle = '#8c001a';
    ctx.font = '16px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🎂 Happy Birthday! 🎂', width / 2, 575);

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
