'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getGuests, saveGuest, updateGuest, deleteGuest, bulkSaveGuests, GuestData } from '@/lib/supabase';
import config from '@/data/config.json';
import * as XLSX from 'xlsx';
import styles from '@/styles/GuestManagement.module.css';

interface Guest {
  id: number;
  title: string;
  name: string;
  phone: string | null;
  child_name: string;
  created_at: string;
  updated_at: string;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
}

export default function GuestManagementPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'upload' | 'quiz'>('list');
  const [modalMessage, setModalMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);

  const searchParams = useSearchParams();
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const defaultQuiz = config.quiz as QuizQuestion[] || [];

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    name: '',
    phone: '',
  });

  // Edit state
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);

  // WhatsApp message state
  const [customMessage, setCustomMessage] = useState('Hi {title} {name}, you\'re invited to Emma\'s birthday party! 🎉');
  const [selectedGuests, setSelectedGuests] = useState<number[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      const sessionStr = localStorage.getItem('adminSession');
      if (!sessionStr) {
        router.push('/auth');
        return;
      }

      try {
        const session = JSON.parse(sessionStr);
        setUser({
          id: session.id,
          email: session.email,
          childName: 'Emma', // Default or fetch from config
        });

        // Fetch guests
        const guestResult = await getGuests('Emma');
        setGuests(guestResult?.data || []);
        setLoading(false);
      } catch (err) {
        console.error('Session error:', err);
        localStorage.removeItem('adminSession');
        router.push('/auth');
      }
    };

    const loadQuiz = () => {
      try {
        const stored = localStorage.getItem('birthdayQuizQuestions');
        if (stored) {
          const parsed = JSON.parse(stored) as QuizQuestion[];
          if (Array.isArray(parsed) && parsed.length > 0) {
            setQuizQuestions(parsed);
            return;
          }
        }
      } catch (e) {
        console.warn('Failed to parse quiz from localStorage', e);
      }
      setQuizQuestions(defaultQuiz);
    };

    checkAuth();
    loadQuiz();

    const tab = searchParams?.get('tab');
    if (tab === 'quiz') {
      setActiveTab('quiz');
    }
  }, [router, defaultQuiz, searchParams]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.name.trim()) {
      setModalMessage({ text: 'Title and Name are required!', type: 'error' });
      return;
    }

    try {
      const guestData: GuestData = {
        title: formData.title.trim(),
        name: formData.name.trim(),
        phone: formData.phone.trim() || undefined,
        childName: user.childName,
      };

      if (editingGuest) {
        await updateGuest(editingGuest.id, guestData);
        setModalMessage({ text: 'Guest updated successfully!', type: 'success' });
      } else {
        await saveGuest(guestData);
        setModalMessage({ text: 'Guest added successfully!', type: 'success' });
      }

      // Refresh guests list
      const guestResult = await getGuests('Emma');
      setGuests(guestResult?.data || []);

      // Reset form
      setFormData({ title: '', name: '', phone: '' });
      setEditingGuest(null);
      setActiveTab('list');
    } catch (err) {
      setModalMessage({ text: 'Failed to save guest. Please try again.', type: 'error' });
    }

    setTimeout(() => setModalMessage(null), 3000);
  };

  const handleEdit = (guest: Guest) => {
    setEditingGuest(guest);
    setFormData({
      title: guest.title,
      name: guest.name,
      phone: guest.phone || '',
    });
    setActiveTab('add');
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this guest?')) return;

    try {
      await deleteGuest(id);
      setGuests(guests.filter(g => g.id !== id));
      setModalMessage({ text: 'Guest deleted successfully!', type: 'success' });
    } catch (err) {
      setModalMessage({ text: 'Failed to delete guest. Please try again.', type: 'error' });
    }

    setTimeout(() => setModalMessage(null), 3000);
  };

  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if it's an Excel file
    const allowedTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv'
    ];

    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.csv') && !file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setModalMessage({ text: 'Please upload a valid Excel (.xlsx, .xls) or CSV file.', type: 'error' });
      return;
    }

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (jsonData.length < 2) {
        setModalMessage({ text: 'File must contain at least a header row and one data row.', type: 'error' });
        return;
      }

      const headers = (jsonData[0] as string[]).map(h => h?.toString().trim().toLowerCase() || '');
      const titleIndex = headers.findIndex(h => h.includes('title'));
      const nameIndex = headers.findIndex(h => h.includes('name'));
      const phoneIndex = headers.findIndex(h => h.includes('phone') || h.includes('number'));

      if (titleIndex === -1 || nameIndex === -1) {
        setModalMessage({ text: 'File must contain columns with "title" and "name" in the header.', type: 'error' });
        return;
      }

      const guestList: GuestData[] = [];
      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i] as (string | number | null)[];
        const title = row[titleIndex]?.toString().trim();
        const name = row[nameIndex]?.toString().trim();
        const phone = phoneIndex !== -1 ? row[phoneIndex]?.toString().trim() : undefined;

        if (title && name) {
          guestList.push({
            title,
            name,
            phone,
            childName: user.childName,
          });
        }
      }

      if (guestList.length === 0) {
        setModalMessage({ text: 'No valid guest data found in the file.', type: 'error' });
        return;
      }

      await bulkSaveGuests(guestList);

      // Refresh guests list
      const guestResult = await getGuests('Emma');
      setGuests(guestResult?.data || []);

      setModalMessage({ text: `${guestList.length} guests imported successfully!`, type: 'success' });
      setActiveTab('list');
    } catch (err) {
      console.error('Excel parsing error:', err);
      setModalMessage({ text: 'Failed to import guests. Please check your file format and try again.', type: 'error' });
    }

    // Reset file input
    e.target.value = '';

    setTimeout(() => setModalMessage(null), 3000);
  };

  const generateWhatsAppMessage = (guest: Guest, includeRsvp = true) => {
    const message = customMessage
      .replaceAll('{title}', guest.title || '')
      .replaceAll('{name}', guest.name || '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!includeRsvp || !guest.name) {
      return message;
    }

    const rsvpName = `${guest.title ? guest.title + ' ' : ''}${guest.name}`.trim();
    const rsvpUrl = new URL(`${window.location.origin}/`);
    rsvpUrl.searchParams.set('name', rsvpName);
    if (guest.phone) {
      const sanitizedPhone = guest.phone.replace(/\D/g, '');
      if (sanitizedPhone) {
        rsvpUrl.searchParams.set('phone', sanitizedPhone);
      }
    }
    rsvpUrl.hash = 'rsvp';

    return `${message}\n\nPlease RSVP here: ${rsvpUrl.toString()}`;
  };

  const handleSendWhatsApp = (guest: Guest) => {
    if (!guest.phone) {
      setModalMessage({ text: 'No phone number available for this guest.', type: 'error' });
      setTimeout(() => setModalMessage(null), 3000);
      return;
    }

    const message = encodeURIComponent(generateWhatsAppMessage(guest));
    const phone = guest.phone.replace(/\D/g, '');
    const url = `https://wa.me/${phone}?text=${message}`;
    window.open(url, '_blank');
  };

  const handleBulkWhatsApp = () => {
    if (selectedGuests.length === 0) {
      setModalMessage({ text: 'Please select guests to send messages to.', type: 'error' });
      setTimeout(() => setModalMessage(null), 3000);
      return;
    }

    const selectedGuestData = guests.filter(g => selectedGuests.includes(g.id) && g.phone);
    if (selectedGuestData.length === 0) {
      setModalMessage({ text: 'None of the selected guests have phone numbers.', type: 'error' });
      setTimeout(() => setModalMessage(null), 3000);
      return;
    }

    // Open WhatsApp for each guest
    selectedGuestData.forEach(guest => {
      setTimeout(() => {
        handleSendWhatsApp(guest);
      }, 1000); // Small delay between openings
    });

    setModalMessage({ text: `Opening WhatsApp for ${selectedGuestData.length} guests...`, type: 'success' });
    setTimeout(() => setModalMessage(null), 3000);
  };

  const handleShareMessage = () => {
    const message = generateWhatsAppMessage({ title: '{title}', name: '{name}' } as Guest, false);
    if (navigator.share) {
      navigator.share({
        title: 'Birthday Party Invitation',
        text: message,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(message).then(() => {
        setModalMessage({ text: 'Message copied to clipboard!', type: 'success' });
        setTimeout(() => setModalMessage(null), 3000);
      });
    }
  };

  const handleQuizQuestionChange = (questionIndex: number, updatedQuestion: Partial<QuizQuestion>) => {
    setQuizQuestions((prev) =>
      prev.map((q, idx) => {
        if (idx !== questionIndex) return q;
        return { ...q, ...updatedQuestion };
      })
    );
  };

  const handleSaveQuiz = () => {
    if (quizQuestions.length !== 5) {
      setModalMessage({ text: 'Please have exactly 5 quiz questions.', type: 'error' });
      setTimeout(() => setModalMessage(null), 3000);
      return;
    }

    for (const question of quizQuestions) {
      if (!question.question.trim() || question.options.length !== 4 || question.options.some((opt) => !opt.trim())) {
        setModalMessage({ text: 'All questions must have text and exactly 4 options filled.', type: 'error' });
        setTimeout(() => setModalMessage(null), 3000);
        return;
      }
      if (question.correctIndex < 0 || question.correctIndex >= 4) {
        setModalMessage({ text: 'Each question needs one correct option selected.', type: 'error' });
        setTimeout(() => setModalMessage(null), 3000);
        return;
      }
    }

    localStorage.setItem('birthdayQuizQuestions', JSON.stringify(quizQuestions));
    setModalMessage({ text: 'Quiz settings saved successfully.', type: 'success' });
    setTimeout(() => setModalMessage(null), 3000);
  };

  const handleResetQuiz = () => {
    setQuizQuestions(defaultQuiz);
    localStorage.removeItem('birthdayQuizQuestions');
    setModalMessage({ text: 'Quiz reset to default questions.', type: 'success' });
    setTimeout(() => setModalMessage(null), 3000);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingSpinner}>
          <div className={styles.spinner}></div>
          <p>Loading guest management...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.bg}></div>

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <h1 className={styles.headerTitle}>👥 Guest Management</h1>
            <p className={styles.headerSubtitle}>
              Manage your guest list for {user.childName}'s party
            </p>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className={styles.tabContainer}>
        <button
          className={`${styles.tabBtn} ${activeTab === 'list' ? styles.active : ''}`}
          onClick={() => {
            setActiveTab('list');
            setEditingGuest(null);
            setFormData({ title: '', name: '', phone: '' });
          }}
        >
          📋 Guest List ({guests.length})
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'add' ? styles.active : ''}`}
          onClick={() => setActiveTab('add')}
        >
          ➕ Add Guest
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'upload' ? styles.active : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          📊 Upload Excel
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'quiz' ? styles.active : ''}`}
          onClick={() => setActiveTab('quiz')}
        >
          🧠 Quiz Management
        </button>
      </div>

      {/* Content */}
      <main className={styles.contentArea}>
        {activeTab === 'list' && (
          <div className={styles.listSection}>
            {/* WhatsApp Message Editor */}
            <div className={styles.messageEditor}>
              <h3>💬 Custom WhatsApp Message</h3>
              <textarea
                className={styles.messageTextarea}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Enter your custom message. Use {title} and {name} to insert guest details."
              />
              <div className={styles.messageActions}>
                <button className={styles.shareBtn} onClick={handleShareMessage}>
                  📤 Share Message
                </button>
                {selectedGuests.length > 0 && (
                  <button className={styles.bulkWhatsAppBtn} onClick={handleBulkWhatsApp}>
                    📱 Send to {selectedGuests.length} Selected
                  </button>
                )}
              </div>
            </div>

            {guests.length === 0 ? (
              <div className={styles.emptyState}>
                <p className={styles.emptyIcon}>👥</p>
                <p className={styles.emptyText}>No guests added yet!</p>
                <button
                  className={styles.addFirstBtn}
                  onClick={() => setActiveTab('add')}
                >
                  Add Your First Guest
                </button>
              </div>
            ) : (
              <div className={styles.guestsList}>
                {guests.map((guest) => (
                  <div key={guest.id} className={styles.guestCard}>
                    <div className={styles.guestSelect}>
                      <input
                        type="checkbox"
                        id={`guest-${guest.id}`}
                        checked={selectedGuests.includes(guest.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedGuests([...selectedGuests, guest.id]);
                          } else {
                            setSelectedGuests(selectedGuests.filter(id => id !== guest.id));
                          }
                        }}
                      />
                      <label htmlFor={`guest-${guest.id}`}></label>
                    </div>
                    <div className={styles.guestInfo}>
                      <h4>{guest.title} {guest.name}</h4>
                      {guest.phone && <p>📞 {guest.phone}</p>}
                      <p className={styles.date}>
                        Added {new Date(guest.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className={styles.guestActions}>
                      {guest.phone && (
                        <button
                          className={styles.actionBtn}
                          onClick={() => handleSendWhatsApp(guest)}
                          title="Send WhatsApp Message"
                        >
                          💬
                        </button>
                      )}
                      <button
                        className={styles.actionBtn}
                        onClick={() => handleEdit(guest)}
                        title="Edit Guest"
                      >
                        ✏️
                      </button>
                      <button
                        className={styles.actionBtn}
                        onClick={() => handleDelete(guest.id)}
                        title="Delete Guest"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className={styles.quizAdminSection}>
            <h3>🧠 Quiz Management</h3>
            <p>Admin can maintain exactly 5 questions for the homepage quiz.</p>

            {quizQuestions.map((question, qIndex) => (
              <fieldset key={question.id} className={styles.quizQuestionBlock}>
                <legend>Question {qIndex + 1}</legend>

                <label>
                  Question
                  <input
                    type="text"
                    value={question.question}
                    onChange={(e) => handleQuizQuestionChange(qIndex, { question: e.target.value })}
                  />
                </label>

                {question.options.map((option, optionIndex) => (
                  <label key={optionIndex}>
                    Option {optionIndex + 1}
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const updatedOptions = [...question.options];
                        updatedOptions[optionIndex] = e.target.value;
                        handleQuizQuestionChange(qIndex, { options: updatedOptions });
                      }}
                    />
                  </label>
                ))}

                <div className={styles.correctAnswerRow}>
                  <span>Correct answer:</span>
                  {question.options.map((_, optionIndex) => (
                    <label key={optionIndex}>
                      <input
                        type="radio"
                        name={`correct-${qIndex}`}
                        checked={question.correctIndex === optionIndex}
                        onChange={() => handleQuizQuestionChange(qIndex, { correctIndex: optionIndex })}
                      />
                      {optionIndex + 1}
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}

            <div className={styles.quizActions}>
              <button className={styles.saveQuizBtn} onClick={handleSaveQuiz}>Save Quiz</button>
              <button className={styles.resetQuizBtn} onClick={handleResetQuiz}>Reset to Default</button>
            </div>
          </div>
        )}

        {activeTab === 'add' && (
          <div className={styles.addSection}>
            <div className={styles.formCard}>
              <h3>{editingGuest ? '✏️ Edit Guest' : '➕ Add New Guest'}</h3>
              <form onSubmit={handleFormSubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="title">Title *</label>
                  <select
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  >
                    <option value="">Select Title</option>
                    <option value="Mr.">Mr.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Ms.">Ms.</option>
                    <option value="Dr.">Dr.</option>
                    <option value="Prof.">Prof.</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="name">Name *</label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter guest name"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phone">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>

                <div className={styles.formActions}>
                  <button type="submit" className={styles.saveBtn}>
                    {editingGuest ? 'Update Guest' : 'Add Guest'}
                  </button>
                  <button
                    type="button"
                    className={styles.cancelBtn}
                    onClick={() => {
                      setActiveTab('list');
                      setEditingGuest(null);
                      setFormData({ title: '', name: '', phone: '' });
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'upload' && (
          <div className={styles.uploadSection}>
            <div className={styles.uploadCard}>
              <h3>📊 Upload Guest List</h3>
              <p className={styles.uploadDescription}>
                Upload an Excel or CSV file with your guest list. The file should have columns for "title", "name", and optionally "phone".
              </p>

              <div className={styles.fileUpload}>
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleExcelUpload}
                  id="fileInput"
                  className={styles.fileInput}
                />
                <label htmlFor="fileInput" className={styles.fileLabel}>
                  📎 Choose File
                </label>
              </div>

              <div className={styles.sampleFormat}>
                <h4>Sample Excel/CSV Format:</h4>
                <p>Headers should include: <strong>Title</strong>, <strong>Name</strong>, and optionally <strong>Phone</strong></p>
                <pre>
{`Title,Name,Phone
Mr.,John Doe,+1234567890
Mrs.,Jane Smith,+0987654321
Dr.,Bob Johnson`}
                </pre>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal Popup */}
      {modalMessage && (
        <div className={styles.modalOverlay} onClick={() => setModalMessage(null)}>
          <div className={`${styles.modal} ${styles[modalMessage.type]}`} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setModalMessage(null)}>✕</button>
            <div className={styles.modalContent}>
              <div className={styles.modalIcon}>
                {modalMessage.type === 'success' ? '✨' : '⚠️'}
              </div>
              <p>{modalMessage.text}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}