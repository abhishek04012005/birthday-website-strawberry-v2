'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { saveRSVP } from '@/lib/supabase';
import config from '@/data/config.json';
import styles from '@/styles/RSVP.module.css';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface RSVPProps {
  invitedCount: number;
  comingCount: number;
  features: Array<{ icon: string; text: string }>;
  childName: string;
}

export const RSVP: React.FC<RSVPProps> = ({ invitedCount, comingCount, features, childName }) => {
  const [choice, setChoice] = useState<'yes' | 'no'>('yes');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confirmationNumber, setConfirmationNumber] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    guests: 'Just me 👤',
    message: '',
  });

  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams) return;

    const name = searchParams.get('name') || '';
    const phone = searchParams.get('phone') || '';

    if (!name && !phone) return;

    setFormData((prev) => ({
      ...prev,
      name: decodeURIComponent(name),
      phone: decodeURIComponent(phone),
    }));
  }, [searchParams]);

  let localComingCount = comingCount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter your name 🍓');
      return;
    }

    setLoading(true);

    // Generate unique confirmation number
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const confirmationNum = `RSVP-${timestamp}-${randomNum}`;

    // Save to Supabase
    const rsvpData = {
      guestName: formData.name,
      phone: formData.phone,
      email: formData.email,
      guestCount: parseInt(formData.guests.split(' ')[0]) || 1,
      message: formData.message,
      attending: choice,
      childName,
      submittedAt: new Date().toISOString(),
      confirmationNumber: confirmationNum,
    };

    const result = await saveRSVP(rsvpData);

    setLoading(false);

    if (result.success) {
      setConfirmationNumber(confirmationNum);
      setSubmitted(true);
      setShowConfetti(true);
      setShowConfirmationModal(true);
      setTimeout(() => setShowConfetti(false), 5500);
      if (choice === 'yes') {
        localComingCount += 1;
      }
    } else {
      alert(`Error: ${result.error || 'Failed to save RSVP'}`);
    }
  };

  const downloadConfirmationImage = async () => {
    try {
      // Create a new element with the confirmation content
      const captureElement = document.createElement('div');
      captureElement.style.width = '500px';
      captureElement.style.padding = '40px 30px';
      captureElement.style.background = 'linear-gradient(135deg, #fff8fb 0%, #fdf3f7 50%, #fef7fa 100%)';
      captureElement.style.borderRadius = '24px';
      captureElement.style.textAlign = 'center';
      captureElement.style.position = 'absolute';
      captureElement.style.left = '-9999px';
      captureElement.style.top = '-9999px';
      captureElement.style.zIndex = '-1';
      captureElement.style.fontFamily = '"Nunito", sans-serif';
      captureElement.style.color = '#333';

      captureElement.innerHTML = `
        <div style="margin-bottom: 30px;">
          <div style="font-size: 2.5rem; margin-bottom: 10px;">🎉🍓🎂</div>
          <h1 style="color: #e8243c; font-family: 'Pacifico', cursive; font-size: 2.2rem; margin: 0 0 8px 0; text-shadow: 2px 2px 0 rgba(232, 36, 60, 0.1);">RSVP Confirmed!</h1>
          <p style="color: #8c001a; font-size: 1rem; margin: 0; font-weight: 600;">You're invited to ${config.child.name}'s Birthday Party!</p>
        </div>

        <div style="margin-bottom: 30px;">
          <div style="background: white; padding: 20px; border-radius: 16px; margin-bottom: 20px; box-shadow: 0 4px 16px rgba(232, 36, 60, 0.1); border: 2px solid #ffd6e0;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px;">
              <div>
                <div style="color: #8c001a; font-weight: 700; font-size: 0.9rem; margin-bottom: 4px;">Guest Name:</div>
                <div style="font-weight: 600; color: #e8243c; font-size: 0.9rem;">${formData.name}</div>
              </div>
              <div>
                <div style="color: #8c001a; font-weight: 700; font-size: 0.9rem; margin-bottom: 4px;">Confirmation #:</div>
                <div style="font-weight: 600; color: #e8243c; font-size: 0.9rem; font-family: monospace;">${confirmationNumber}</div>
              </div>
              <div>
                <div style="color: #8c001a; font-weight: 700; font-size: 0.9rem; margin-bottom: 4px;">Attending:</div>
                <div style="font-weight: 600; color: ${choice === 'yes' ? '#16a34a' : '#dc2626'}; font-size: 0.9rem;">${choice === 'yes' ? '✅ Yes, I\'ll be there!' : '❌ Sorry, can\'t make it'}</div>
              </div>
              <div>
                <div style="color: #8c001a; font-weight: 700; font-size: 0.9rem; margin-bottom: 4px;">Number of Guests:</div>
                <div style="font-weight: 600; color: #e8243c; font-size: 0.9rem;">${formData.guests}</div>
              </div>
            </div>

            <div style="border-top: 2px solid #ffd6e0; padding-top: 20px;">
              <h3 style="color: #e8243c; font-family: 'Pacifico', cursive; font-size: 1.4rem; margin: 0 0 15px 0;">Party Details</h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div>
                  <span style="color: #8c001a; font-weight: 700;">📅</span>
                  <div style="font-weight: 600; font-size: 0.9rem; margin-top: 4px;">${config.party.date}</div>
                  <div style="font-size: 0.75rem; opacity: 0.9;">${config.party.time}</div>
                </div>
                <div>
                  <span style="color: #8c001a; font-weight: 700;">📍</span>
                  <div style="font-weight: 600; font-size: 0.9rem; margin-top: 4px;">${config.party.venue}</div>
                  <div style="font-size: 0.75rem; opacity: 0.9;">${config.party.address}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style="padding: 20px 0; border-top: 2px solid #ffd6e0; margin-top: 20px;">
          <p style="font-size: 1rem; color: #8c001a; margin: 0 0 8px 0; font-weight: 600;">🎈 We can't wait to celebrate with you! 🎈</p>
          <p style="font-size: 0.8rem; color: #666; margin: 0;">Please bring this confirmation with you to the party</p>
        </div>
      `;

      document.body.appendChild(captureElement);

      // Wait for rendering
      await new Promise(resolve => setTimeout(resolve, 300));

      const canvas = await html2canvas(captureElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: captureElement.offsetWidth,
        height: captureElement.offsetHeight,
        scrollX: 0,
        scrollY: 0,
        logging: false,
        imageTimeout: 0,
        removeContainer: true,
      });

      // Remove temporary element
      document.body.removeChild(captureElement);

      const link = document.createElement('a');
      link.download = `RSVP_Confirmation_${formData.name.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download confirmation image. Please try again.');
    }
  };

  return (
    <>
      <section className={styles.rsvpBg} id="rsvp">
      {showConfetti && (
        <div className={styles.confettiOverlay}>
          {Array.from({ length: 40 }).map((_, index) => {
            const emojis = ['✨', '🎉', '🎊', '🍓', '🎈', '🧁'];
            const emoji = emojis[index % emojis.length];
            const left = Math.random() * 100;
            const delay = Math.random() * 1.2;
            const duration = 2.8 + Math.random() * 1.2;

            return (
              <span
                key={index}
                className={styles.confettiPiece}
                style={{
                  left: `${left}%`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                  fontSize: `${12 + Math.random() * 18}px`,
                }}
              >
                {emoji}
              </span>
            );
          })}
        </div>
      )}
      <div className={styles.rsvpFloaters}>
        <div className={styles.rf}>🍓</div>
        <div className={styles.rf}>🌸</div>
        <div className={styles.rf}>🍓</div>
        <div className={styles.rf}>🎀</div>
        <div className={styles.rf}>✨</div>
      </div>

      <div className={styles.rsvpInner}>
        <div>
          <div className={styles.secPill}>🎟 Join the Fun</div>
          <h2 className={styles.secTitleWhite} style={{ marginBottom: '14px' }}>
            RSVP &amp; Secure<br />
            Your Sweet Spot!
          </h2>
          <p className={styles.secSubWhite} style={{ margin: '0 0 30px', textAlign: 'left' }}>
            We're counting on your smiles! Let us know you're coming so we can save you the biggest slice of strawberry cake! 🎁🍓
          </p>

          <div className={styles.rsvpStatGrid}>
            <div className={styles.rStat}>
              <span className={styles.rStatNum}>{invitedCount}</span>
              <span className={styles.rStatLabel}>Invited</span>
            </div>
            <div className={styles.rStat}>
              <span className={styles.rStatNum}>{localComingCount}</span>
              <span className={styles.rStatLabel}>Coming</span>
            </div>
            <div className={styles.rStat}>
              <span className={styles.rStatNum}>🍰</span>
              <span className={styles.rStatLabel}>Cakes!</span>
            </div>
          </div>

          <div className={styles.rsvpFeatures}>
            {features.map((feat, idx) => (
              <div key={idx} className={styles.rsvpFeat}>
                <div className={styles.rsvpFeatIcon}>{feat.icon}</div>
                {feat.text}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.rsvpCard}>
          {!submitted ? (
            <form onSubmit={handleSubmit}>
              <div className={styles.rsvpCardTitle}>🍓 Will You Come? 🍓</div>
              <div className={styles.attendOpts}>
                <div
                  className={`${styles.attendOpt} ${choice === 'yes' ? styles.active : ''}`}
                  onClick={() => setChoice('yes')}
                >
                  <span>🎉</span>
                  Yes, I'll be there!
                </div>
                <div
                  className={`${styles.attendOpt} ${choice === 'no' ? styles.active : ''}`}
                  onClick={() => setChoice('no')}
                >
                  <span>😢</span>
                  Can't make it
                </div>
              </div>

              <div className={styles.frow}>
                <div className={styles.fgroup}>
                  <label>Your Name *</label>
                  <input
                    type="text"
                    placeholder="Jane Smith"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className={styles.fgroup}>
                  <label>WhatsApp / Phone</label>
                  <input
                    type="tel"
                    placeholder="+1 234 567 8900"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className={styles.frow}>
                {/* <div className={styles.fgroup}>
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="jane@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div> */}
                <div className={styles.fgroup} style={{ width: '100%', gridColumn: '1 / -1' }}>
                  <label>Number of Guests</label>
                  <div className={styles.guestButtonGroup}>
                    {['Just me 👤', '2 people 👥', '3 people 👨‍👩‍👦', '4+ people 🎉'].map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={`${styles.guestButton} ${formData.guests === option ? styles.guestButtonActive : ''}`}
                        onClick={() => setFormData({ ...formData, guests: option })}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* <div className={styles.fgroup}>
                <label>Sweet Birthday Wish 🍓</label>
                <textarea
                  placeholder="Share a sweet message for our birthday girl..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
              </div> */}

              <button type="submit" className={styles.rsvpSubmit} disabled={loading}>
                {loading ? '⏳ Sending...' : '🍓 Send My RSVP! 🎉'}
              </button>
            </form>
          ) : (
            <div className={styles.rsvpOk}>
              <span className={styles.rsvpOkEmoji}>🍓🎉🎂</span>
              <h3>Yay! You're Coming!</h3>
              <div className={styles.confirmationDetails}>
                <div className={styles.confirmationNumber}>
                  <span className={styles.confirmationLabel}>Confirmation Number:</span>
                  <span className={styles.confirmationValue}>{confirmationNumber}</span>
                </div>
                <p className={styles.confirmationText}>
                  We've saved your spot! Your slice of strawberry birthday cake &amp; goodie bag are ready.<br />
                  <br />
                  See you on the big day! 💕🎈
                </p>
                <button
                  onClick={() => setShowConfirmationModal(true)}
                  className={styles.downloadBtn}
                >
                  📸 Download Confirmation Image
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>

    {/* Confirmation Modal */}
    {showConfirmationModal && (
      <div className={styles.confirmationModal}>
        <div className={styles.modalBackdrop} onClick={() => setShowConfirmationModal(false)}></div>
        <div className={styles.modalContent}>
          <button
            className={styles.modalClose}
            onClick={() => setShowConfirmationModal(false)}
          >
            ✕
          </button>

          <div id="confirmation-modal-content" className={styles.confirmationImage}>
            <div className={styles.imageHeader}>
              <div className={styles.imageEmojis}>🎉🍓🎂</div>
              <h1 className={styles.imageTitle}>RSVP Confirmed!</h1>
              <p className={styles.imageSubtitle}>You're invited to {config.child.name}'s Birthday Party!</p>
            </div>

            <div className={styles.imageBody}>
              <div className={styles.guestInfo}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Guest Name:</span>
                  <span className={styles.infoValue}>{formData.name}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Confirmation #:</span>
                  <span className={styles.infoValue}>{confirmationNumber}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Attending:</span>
                  <span className={styles.infoValue}>
                    {choice === 'yes' ? '✅ Yes, I\'ll be there!' : '❌ Sorry, can\'t make it'}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Number of Guests:</span>
                  <span className={styles.infoValue}>{formData.guests}</span>
                </div>
              </div>

              <div className={styles.partyDetails}>
                <h3>Party Details</h3>
                <div className={styles.detailGrid}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailIcon}>📅</span>
                    <div>
                      <strong>{config.party.date}</strong>
                      <br />
                      <small>{config.party.time}</small>
                    </div>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailIcon}>📍</span>
                    <div>
                      <strong>{config.party.venue}</strong>
                      <br />
                      <small>{config.party.address}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.imageFooter}>
              <p>🎈 We can't wait to celebrate with you! 🎈</p>
              <p className={styles.footerNote}>Please bring this confirmation with you to the party</p>
            </div>
          </div>

          <div className={styles.modalActions}>
            <button
              onClick={downloadConfirmationImage}
              className={styles.downloadImageBtn}
            >
              📸 Download Confirmation Image
            </button>
            <button
              onClick={() => setShowConfirmationModal(false)}
              className={styles.closeModalBtn}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};
