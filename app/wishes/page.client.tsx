'use client';

import React, { useEffect, useState } from 'react';
import { getCurrentUser, saveWish, getWishes, getVisibleWishes, updateWishVisibility } from '@/lib/supabase';
import config from '@/data/config.json';
import styles from '@/styles/Wishes.module.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Wave } from '@/components/Utils';

interface Wish {
  id: number;
  guest_name: string;
  guest_phone: string;
  wish_text: string;
  child_name: string;
  submitted_at: string;
  is_visible?: boolean;
}

export default function WishesClient() {
  const [visibleWishes, setVisibleWishes] = useState<Wish[]>([]);
  const [allWishes, setAllWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [wishText, setWishText] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [modalMessage, setModalMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    const load = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      await refreshWishes(currentUser);
    };
    load();
  }, []);

  const refreshWishes = async (currentUser: any) => {
    setLoading(true);

    const visibleRes = await getVisibleWishes(config.child.name);
    if (visibleRes.success) setVisibleWishes(visibleRes.data || []);

    if (currentUser) {
      const allRes = await getWishes(config.child.name);
      if (allRes.success) setAllWishes(allRes.data || []);
    }

    setLoading(false);
  };

  const handlePrintWishes = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const printableWishes = (user ? allWishes : visibleWishes).slice(0, 8);
  const printSlots = Array.from({ length: 8 }, (_, index) => printableWishes[index] || null);

  const submitWish = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!guestName.trim() || !guestPhone.trim() || !wishText.trim()) {
      setModalMessage({ text: 'Please enter name, phone number and wish message.', type: 'error' });
      setTimeout(() => setModalMessage(null), 3000);
      return;
    }

    setSubmitting(true);
    const result = await saveWish({
      guestName,
      guestPhone,
      wishText,
      childName: config.child.name,
      createdAt: new Date().toISOString(),
    });

    if (result.success) {
      setModalMessage({ text: 'Wish submitted successfully! It will appear on home if approved.', type: 'success' });
      setGuestName('');
      setGuestPhone('');
      setWishText('');
      await refreshWishes(user);
      setTimeout(() => setModalMessage(null), 3000);
    } else {
      setModalMessage({ text: `Submission failed: ${result.error || 'Unknown error'}`, type: 'error' });
      setTimeout(() => setModalMessage(null), 3000);
    }

    setSubmitting(false);
  };

  const toggleVisibility = async (wishId: number, currentVisibility: boolean) => {
    const res = await updateWishVisibility(wishId, !currentVisibility);
    if (res.success) {
      setModalMessage({ text: 'Visibility updated successfully!', type: 'success' });
      await refreshWishes(user);
      setTimeout(() => setModalMessage(null), 3000);
    } else {
      setModalMessage({ text: `Failed to update visibility: ${res.error || 'Unknown error'}`, type: 'error' });
      setTimeout(() => setModalMessage(null), 3000);
    }
  };

  return (
    <main>
      <Navbar childName={config.child.name} />

      <div className={styles.wishesPageContainer}>
        <div className={styles.wishesBg}></div>

        <div className={styles.wishesInner}>
          <div className={styles.wishesHeader}>
            <h1 className={styles.wishesTitle}>🎈 Birthday Wishes</h1>
            <p className={styles.wishesSubtitle}>All the love and wishes for {config.child.name}'s special day.</p>
            <p className={styles.wishCount}>Approved on home: {visibleWishes.length}</p>
          </div>

          <div className={styles.formBlock}>
            <h2>Send a Wish</h2>
            <form className={styles.wishForm} onSubmit={submitWish}>
              <input type="text" placeholder="Your name" value={guestName} onChange={(e) => setGuestName(e.target.value)} />
              <input type="tel" placeholder="Your phone number" value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} />
              <textarea placeholder="Write your wish" value={wishText} onChange={(e) => setWishText(e.target.value)} rows={4} />
              <button type="submit" disabled={submitting}>{submitting ? 'Sending...' : 'Send Wish'}</button>
            </form>
            <p className={styles.formMessage}>{message}</p>
          </div>

          <div className={styles.visibleSection}>
            <h2>Visible Wishes on Home Screen</h2>
            <div className={styles.wishesGrid}>
              {visibleWishes.length === 0 && <p>No visible wishes yet.</p>}
              {visibleWishes.map((wish, index) => (
                <div key={index} className={styles.wishCardContainer}>
                  <div className={styles.wishCard}>
                    <div className={styles.wishHeader}>
                      <h3 className={styles.guestName}>{wish.guest_name}</h3>
                      <span className={styles.wishDate}>{new Date(wish.submitted_at).toLocaleDateString()}</span>
                    </div>
                    <p className={styles.wishText}>{wish.wish_text}</p>
                    <p className={styles.guestPhone}>📞 {wish.guest_phone}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {user && (
            <div className={styles.adminSection}>
              <div className={styles.adminSectionHeader}>
                <div>
                  <h2>Admin Controls: Manage Wish Visibility</h2>
                  <p className={styles.adminSectionNote}>
                    Download a printable A4 sheet with up to 8 birthday wishes and signature lines.
                  </p>
                </div>
                <button className={styles.downloadSheetBtn} onClick={handlePrintWishes}>
                  Download A4 Wishes Sheet
                </button>
              </div>

              {allWishes.length === 0 ? (
                <p>No wishes submitted yet.</p>
              ) : (
                <ul className={styles.adminList}>
                  {allWishes.map((wish, index) => (
                    <li key={index} className={styles.adminItem}>
                      <div>
                        <strong>{wish.guest_name}</strong> ({wish.guest_phone})
                        <p>{wish.wish_text}</p>
                        <small>{new Date(wish.submitted_at).toLocaleString()}</small>
                      </div>
                      <button
                        className={wish.is_visible ? styles.hideBtn : styles.showBtn}
                        onClick={() => toggleVisibility(wish.id as unknown as number, !!wish.is_visible)}
                      >
                        {wish.is_visible ? 'Hide from Home' : 'Show on Home'}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

        </div>

        <div id="wish-print-sheet" className={styles.printSheet}>
          <div className={styles.printHeader}>
            <h1>{config.child.name}'s Birthday Wishes</h1>
            <p>Happy birthday {config.child.name}! Here are the wishes to sign and celebrate.</p>
          </div>
          <div className={styles.printGrid}>
            {printSlots.map((wish, index) => (
              <div key={index} className={styles.printCard}>
                <div className={styles.printCardNumber}>Wish {index + 1}</div>
                <div className={styles.printWishText}>
                  {wish ? wish.wish_text : 'Write your birthday message here...'}
                </div>
                <div className={styles.printFrom}>
                  <span>From:</span> {wish ? wish.guest_name : '__________________'}
                </div>
                <div className={styles.printSignature}>
                  <span>Signature:</span>
                  <div className={styles.signatureLine} />
                </div>
              </div>
            ))}
          </div>
          <div className={styles.printFooter}>
            <p>Print this page on A4 paper for a ready-to-sign wishing sheet.</p>
          </div>
        </div>
      </div>

      <Wave bgColor="#fff0f4" svgColor="#fffaf5" />
    </main>
  );
}
