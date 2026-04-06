'use client';

import React, { useEffect, useState } from 'react';
import { getVisibleWishes, saveWish, WishData } from '@/lib/supabase';
import styles from '@/styles/HomepageWishes.module.css';

interface Wish {
  id: string;
  guest_name: string;
  wish_text: string;
  submitted_at: string;
  is_visible: boolean;
}

interface HomepageWishesProps {
  childName: string;
}

export const HomepageWishes: React.FC<HomepageWishesProps> = ({ childName }) => {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideWidth, setSlideWidth] = useState(324); // default: 300px slide + 24px gap
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [wishText, setWishText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const calculateSlideWidth = () => {
    if (typeof window === 'undefined') return 324;
    const width = window.innerWidth;
    if (width <= 480) return width - 88; // calc(100vw - 100px) + 12px gap ≈ vw - 88
    if (width <= 768) return 256; // 240px + 16px gap
    if (width <= 960) return 300; // 280px + 20px gap
    return 324; // 300px + 24px gap
  };

  useEffect(() => {
    setSlideWidth(calculateSlideWidth());
    const handleResize = () => setSlideWidth(calculateSlideWidth());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchWishes = async () => {
      const result = await getVisibleWishes(childName);
      setWishes(result?.data || []);
      setLoading(false);
    };
    fetchWishes();
  }, [childName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitSuccess(false);
    setSubmitError('');

    if (!guestName.trim() || !guestPhone.trim() || !wishText.trim()) {
      setSubmitError('Please fill in all fields before sending your wish.');
      return;
    }

    setSubmitting(true);

    const payload: WishData = {
      guestName,
      guestPhone,
      wishText,
      childName,
      createdAt: new Date().toISOString(),
    };

    const result = await saveWish(payload);
    setSubmitting(false);

    if (result.success) {
      setSubmitSuccess(true);
      setGuestName('');
      setGuestPhone('');
      setWishText('');
      setTimeout(() => setSubmitSuccess(false), 4000);
    } else {
      setSubmitError(result.error || 'Failed to submit your wish.');
    }
  };

  const [isTransitioning, setIsTransitioning] = useState(true);

  // Auto-scroll carousel with infinite loop
  useEffect(() => {
    if (wishes.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        const next = prev + 1;
        if (next >= wishes.length) {
          // Disable transition and reset position
          setIsTransitioning(false);
          setTimeout(() => {
            setCurrentSlide(0);
            setTimeout(() => setIsTransitioning(true), 50);
          }, 0);
          return prev;
        }
        return next;
      });
    }, 6000);

    return () => clearInterval(interval);
  }, [wishes.length]);

  // Handle smooth wrapping by duplicating wishes
  const displayWishes = wishes.length > 0 ? [...wishes, ...wishes] : [];

  const nextSlide = () => {
    setCurrentSlide((prev) => {
      const next = prev + 1;
      if (next >= wishes.length) {
        setIsTransitioning(false);
        setTimeout(() => {
          setCurrentSlide(0);
          setTimeout(() => setIsTransitioning(true), 50);
        }, 0);
        return prev;
      }
      return next;
    });
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => {
      const next = prev - 1;
      if (next < 0) {
        setIsTransitioning(false);
        setTimeout(() => {
          setCurrentSlide(wishes.length - 1);
          setTimeout(() => setIsTransitioning(true), 50);
        }, 0);
        return prev;
      }
      return next;
    });
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (loading) {
    return (
      <section className={styles.wishesSection}>
        <div className={styles.loadingSpinner}></div>
      </section>
    );
  }

  return (
    <section className={styles.wishesSection} id="wishes">
      <div className={styles.wishesFloaters}>
        <div className={styles.floater}>💌</div>
        <div className={styles.floater}>✨</div>
        <div className={styles.floater}>💕</div>
        <div className={styles.floater}>🌸</div>
      </div>

      <div className={styles.wishesInner}>
        <div className={styles.wishesHeader}>
          <div className={styles.secPill}>💌 Love & Wishes</div>
          <h2 className={styles.wishesTitle}>
            Birthday Wishes &<br />
            Love Messages
          </h2>
          <p className={styles.wishesSubtitle}>
            Heartfelt messages from everyone who celebrates with {childName} 🎉💕
          </p>
        </div>


        {wishes.length === 0 ? (
          <div className={styles.emptyWishes}>
            <p className={styles.emptyIcon}>💌</p>
            <p className={styles.emptyText}>Wishes will appear here soon! ✨</p>
          </div>
        ) : (
          <div className={styles.carouselContainer}>
            <button 
              className={`${styles.navBtn} ${styles.prevBtn}`}
              onClick={prevSlide}
              aria-label="Previous wishes"
            >
              ←
            </button>

            <div className={styles.carousel}>
              <div 
                className={styles.carouselTrack} 
                style={{ 
                  transform: `translateX(calc(-${currentSlide * slideWidth}px))`,
                  transition: isTransitioning ? 'transform 0.8s linear' : 'none'
                }}
              >
                {displayWishes.map((wish, index) => (
                  <div key={`${wish.id}-${index}`} className={styles.carouselSlide}>
                    <div className={styles.wishCard}>
                      <div className={styles.wishQuoteDecor}>💌</div>
                      <div className={styles.wishQuote}>
                        <p className={styles.wishText}>"{wish.wish_text}"</p>
                      </div>
                      <div className={styles.wishFooter}>
                        <p className={styles.wishFrom}>
                          <strong>{wish.guest_name}</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button 
              className={`${styles.navBtn} ${styles.nextBtn}`}
              onClick={nextSlide}
              aria-label="Next wishes"
            >
              →
            </button>

            {/* Slide Counter */}
            <div className={styles.slideCounter}>
              Slide {(currentSlide % wishes.length) + 1} of {wishes.length}
            </div>
          </div>
        )}

        <div className={styles.wishFormSection}>
          <form className={styles.wishForm} onSubmit={handleSubmit}>
            <div className={styles.wishFormRow}>
              <input
                type="text"
                placeholder="Your name"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className={styles.wishInput}
                disabled={submitting}
              />
              <input
                type="tel"
                placeholder="Your phone number"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                className={styles.wishInput}
                disabled={submitting}
              />
            </div>
            <textarea
              placeholder={`Write your birthday wish for ${childName}...`}
              value={wishText}
              onChange={(e) => setWishText(e.target.value)}
              className={styles.wishTextarea}
              rows={4}
              disabled={submitting}
            />
            <button type="submit" className={styles.wishSubmitBtn} disabled={submitting}>
              {submitting ? 'Sending...' : 'Send Your Wish'}
            </button>
            <p className={styles.formHint}>
              Your wish will be saved to the same birthday wish board and shown on the homepage after approval.
            </p>
            {submitSuccess && <p className={styles.successMessage}>🎉 Wish submitted successfully!</p>}
            {submitError && <p className={styles.errorMessage}>{submitError}</p>}
          </form>
        </div>
      </div>
    </section>
  );
};
