'use client';

import React, { useState } from 'react';
import { saveRSVP } from '@/lib/supabase';
import styles from '@/styles/RSVP.module.css';

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
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    guests: 'Just me 👤',
    message: '',
  });
  let localComingCount = comingCount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter your name 🍓');
      return;
    }

    setLoading(true);

    // Save to Supabase
    const rsvpData = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      guestCount: parseInt(formData.guests.split(' ')[0]) || 1,
      message: formData.message,
      attending: choice,
      childName,
      submittedAt: new Date().toISOString(),
    };

    const result = await saveRSVP(rsvpData);
    
    setLoading(false);
    
    if (result.success) {
      setSubmitted(true);
      if (choice === 'yes') {
        localComingCount += 1;
      }
    } else {
      alert(`Error: ${result.error || 'Failed to save RSVP'}`);
    }
  };

  return (
    <section className={styles.rsvpBg} id="rsvp">
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
                <div className={styles.fgroup}>
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="jane@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className={styles.fgroup}>
                  <label>Number of Guests</label>
                  <select
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                  >
                    <option>Just me 👤</option>
                    <option>2 people 👥</option>
                    <option>3 people 👨‍👩‍👦</option>
                    <option>4+ people 🎉</option>
                  </select>
                </div>
              </div>

              <div className={styles.fgroup}>
                <label>Sweet Birthday Wish 🍓</label>
                <textarea
                  placeholder="Share a sweet message for our birthday girl..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
              </div>

              <button type="submit" className={styles.rsvpSubmit} disabled={loading}>
                {loading ? '⏳ Sending...' : '🍓 Send My RSVP! 🎉'}
              </button>
            </form>
          ) : (
            <div className={styles.rsvpOk}>
              <span className={styles.rsvpOkEmoji}>🍓🎉🎂</span>
              <h3>Yay! You're Coming!</h3>
              <p>
                We've saved your spot! Your slice of strawberry birthday cake &amp; goodie bag are ready.<br />
                <br />
                See you on the big day! 💕🎈
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
