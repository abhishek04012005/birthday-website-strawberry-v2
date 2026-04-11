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

  const handlePrintParticipants = async () => {
    try {
      if (typeof window === 'undefined') return;

      // Check if there are any results to export
      if (results.length === 0) {
        alert('No quiz participants to export. Please wait for participants to complete the quiz.');
        return;
      }

      // Dynamically import libraries only on client
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      // Create a temporary container for PDF generation
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '-9999px';
      tempContainer.style.width = '210mm'; // A4 width
      tempContainer.style.background = 'white';
      tempContainer.style.fontFamily = 'Arial, sans-serif';
      tempContainer.style.padding = '20px';
      tempContainer.style.boxSizing = 'border-box';

      // Add content to temporary container
      tempContainer.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #ff6b9d; padding-bottom: 20px;">
          <h1 style="color: #8c001a; margin: 0; font-size: 28px;">🎯 Quiz Participants Report</h1>
          <h2 style="color: #c44569; margin: 10px 0 0; font-size: 20px;">${config.child.name}'s Birthday</h2>
          <p style="color: #666; margin: 10px 0 0; font-size: 14px;">Complete list of quiz participants and their scores</p>
        </div>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 30px;">
          ${results.map((result, index) => {
            const scorePercentage = (result.score / result.total) * 100;
            return `
              <div style="background: linear-gradient(135deg, #fff7f9 0%, #fff1f6 100%); border: 2px solid #ff6b9d; border-radius: 15px; padding: 20px; min-height: 200px; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <div style="font-size: 14px; font-weight: bold; color: white; background: linear-gradient(135deg, #ff6b9d 0%, #c44569 100%); padding: 6px 12px; border-radius: 20px; display: inline-block; margin-bottom: 12px;">👤 Participant ${index + 1}</div>
                  <div style="margin-bottom: 10px;">
                    <div style="font-size: 12px; font-weight: bold; color: #8c001a; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Name</div>
                    <div style="font-size: 16px; color: #8c001a; font-weight: bold;">${result.name}</div>
                  </div>
                  <div style="margin-bottom: 10px;">
                    <div style="font-size: 12px; font-weight: bold; color: #8c001a; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Phone</div>
                    <div style="font-size: 14px; color: #ff6b9d; font-weight: 600;">${result.phone}</div>
                  </div>
                  <div style="margin-bottom: 15px;">
                    <div style="font-size: 12px; font-weight: bold; color: #8c001a; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Completed Date</div>
                    <div style="font-size: 13px; color: #666;">${new Date(result.completedAt).toLocaleDateString()}</div>
                  </div>
                </div>
                <div>
                  <div style="font-size: 12px; font-weight: bold; color: #8c001a; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Score</div>
                  <div style="font-size: 18px; color: #c0003a; font-weight: 800; margin-bottom: 8px;">${result.score} / ${result.total} ⭐</div>
                  <div style="width: 100%; height: 6px; background: #ffe0ed; border-radius: 10px; overflow: hidden; margin-bottom: 6px;">
                    <div style="width: ${scorePercentage}%; height: 100%; background: linear-gradient(90deg, #ff6b9d 0%, #c44569 100%); border-radius: 10px;"></div>
                  </div>
                  <div style="font-size: 12px; color: #666; text-align: center;">${Math.round(scorePercentage)}% Score</div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
        <div style="text-align: center; border-top: 1px solid #ffd6e1; padding-top: 20px; color: #7d4b58;">
          <p style="margin: 5px 0; font-size: 14px;">Total Participants: <strong>${results.length}</strong></p>
          <p style="margin: 5px 0; font-size: 14px;">Average Score: <strong>${Math.round(results.reduce((sum, entry) => sum + entry.score, 0) / results.length)} / ${total}</strong></p>
          <p style="margin: 15px 0 0; font-size: 12px; color: #999;">Generated on ${new Date().toLocaleString()}</p>
        </div>
      `;

      // Add to document temporarily
      document.body.appendChild(tempContainer);

      // Create canvas from HTML
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 794, // A4 width in pixels at 96 DPI
        height: Math.max(1123, tempContainer.scrollHeight), // A4 height or content height
      });

      // Remove temporary container
      document.body.removeChild(tempContainer);

      // Create PDF
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const availableWidth = pageWidth - 2 * margin;
      const availableHeight = pageHeight - 2 * margin;

      const imgWidth = availableWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = margin;

      // Add image to PDF (handle multiple pages if needed)
      pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, Math.min(imgHeight, availableHeight));

      // Add additional pages if content is too long
      while (heightLeft > availableHeight) {
        pdf.addPage();
        position = margin - (imgHeight - heightLeft);
        heightLeft -= availableHeight;
        pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, Math.min(availableHeight, heightLeft));
      }

      // Download PDF
      const filename = `Quiz_Participants_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(filename);

    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF. Please try again. Error: ' + error.message);
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
            <div>
              <h2>Quiz Participants</h2>
              <p>Who has taken the quiz and what score they achieved.</p>
            </div>
            {results.length > 0 && (
              <button className={styles.downloadSheetBtn} onClick={handlePrintParticipants}>
                Download Participants Sheet
              </button>
            )}
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

      <div id="quiz-print-sheet" className={styles.printSheet}>
        <div className={styles.printHeader}>
          <h1>🎯 Quiz Participants Report - {config.child.name}'s Birthday</h1>
          <p>Complete list of quiz participants and their scores.</p>
        </div>
        <div className={styles.printGrid}>
          {results.length > 0 ? (
            results.map((result, index) => {
              const scorePercentage = (result.score / result.total) * 100;
              return (
                <div key={result.id} className={styles.printCard}>
                  <div>
                    <div className={styles.printCardNumber}>👤 Participant {index + 1}</div>
                    <div className={styles.participantName}>
                      <span>Name</span>
                      {result.name}
                    </div>
                    <div className={styles.participantPhone}>
                      <span>Phone</span>
                      {result.phone}
                    </div>
                    <div className={styles.participantDate}>
                      <span>Completed Date</span>
                      {new Date(result.completedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className={styles.participantScore}>
                    <span>Score</span>
                    <div className={styles.scoreValue}>
                      {result.score} / {result.total} ⭐
                    </div>
                    <div className={styles.scoreBar}>
                      <div
                        className={styles.scoreBarFill}
                        style={{ width: `${scorePercentage}%` }}
                      ></div>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: '#666' }}>
                      {Math.round(scorePercentage)}% Score
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#999' }}>
              No quiz participants yet
            </div>
          )}
        </div>
        <div className={styles.printFooter}>
          <p>Total Participants: <strong>{results.length}</strong></p>
          {results.length > 0 && (
            <p>Average Score: <strong>{Math.round(results.reduce((sum, entry) => sum + entry.score, 0) / results.length)} / {total}</strong></p>
          )}
          <p style={{ marginTop: '20px', fontSize: '0.9rem', color: '#666' }}>
            Generated on {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
