'use client';

import React, { useState, useEffect } from 'react';
import { saveWish, getVisibleWishes, WishData } from '@/lib/supabase';
import { Confetti } from '@/components/Utils';
import styles from '@/styles/WishingPopup.module.css';

interface WishingPopupProps {
  childName: string;
  onClose: () => void;
  isOpen: boolean;
}

export const WishingPopup: React.FC<WishingPopupProps> = ({ childName, onClose, isOpen }) => {
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [wish, setWish] = useState('');
  const [wishes, setWishes] = useState<WishData[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingWishes, setFetchingWishes] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchWishes();
    }
  }, [isOpen]);

  const fetchWishes = async () => {
    setFetchingWishes(true);
    const result = await getVisibleWishes(childName);
    if (result.success) {
      setWishes(result.data);
    }
    setFetchingWishes(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!guestName.trim() || !guestPhone.trim() || !wish.trim()) {
      alert('Please fill in all fields (name, phone, and wish)!');
      return;
    }

    setLoading(true);
    const wishData: WishData = {
      guestName,
      guestPhone,
      wishText: wish,
      childName,
      createdAt: new Date().toISOString(),
    };

    const result = await saveWish(wishData);
    
    if (result.success) {
      setSubmitted(true);
      setShowConfetti(true);
      setGuestName('');
      setGuestPhone('');
      setWish('');
      
      // Refresh wishes list
      await fetchWishes();
      
      // Reset submitted message after 2 seconds
      setTimeout(() => setSubmitted(false), 2000);
      
      // Stop confetti after 3 seconds
      setTimeout(() => setShowConfetti(false), 3000);
    } else {
      alert(`Error: ${result.error}`);
    }
    
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      {showConfetti && <Confetti />}
      
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>
        
        <div className={styles.content}>
          <h2 className={styles.title}>✨ Send a Birthday Wish ✨</h2>
          
          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Your name"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className={styles.input}
              disabled={loading}
            />
            <input
              type="tel"
              placeholder="Your phone number"
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
              className={styles.input}
              disabled={loading}
            />
            <textarea
              placeholder={`Write your birthday wish for ${childName}...`}
              value={wish}
              onChange={(e) => setWish(e.target.value)}
              className={styles.textarea}
              disabled={loading}
              rows={4}
            />
            <button 
              type="submit" 
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? 'Sending...' : '💌 Send Wish'}
            </button>
          </form>

          {submitted && (
            <div className={styles.successMessage}>
              🎉 Your wish has been sent! Thank you! 🍓
            </div>
          )}

          <div className={styles.wishesContainer}>
            <h3 className={styles.wishesTitle}>✨ Latest Wishes (Top 2)</h3>
            {fetchingWishes ? (
              <p className={styles.loadingText}>Loading wishes...</p>
            ) : wishes.length === 0 ? (
              <p className={styles.emptyText}>Be the first to send a wish! 🍓</p>
            ) : (
              <div className={styles.wishesList}>
                {wishes.slice(0, 2).map((w: any, idx) => (
                  <div key={idx} className={styles.wishItem}>
                    <div className={styles.wishHeader}>
                      <span className={styles.guestName}>{w.guest_name || w.guestName}</span>
                    </div>
                    <p className={styles.wishText}>{w.wish_text || w.wishText}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
