'use client';

import React, { useEffect, useState } from 'react';
import { getCurrentUser, getWishes, updateWishVisibility } from '@/lib/supabase';
import config from '@/data/config.json';
import styles from '@/styles/Wishes.module.css';
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

export default function AdminWishesClient() {
  const [allWishes, setAllWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [modalMessage, setModalMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const loadAdmin = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      if (currentUser) {
        const allRes = await getWishes(config.child.name);
        if (allRes.success) setAllWishes(allRes.data || []);
      }
      setLoading(false);
    };

    loadAdmin();
  }, []);

  const handlePrintWishes = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const toggleVisibility = async (wishId: number, currentVisibility: boolean) => {
    const res = await updateWishVisibility(wishId, !currentVisibility);
    if (res.success) {
      setModalMessage({ text: 'Visibility updated successfully!', type: 'success' });
      const allRes = await getWishes(config.child.name);
      if (allRes.success) setAllWishes(allRes.data || []);
      setTimeout(() => setModalMessage(null), 3000);
    } else {
      setModalMessage({ text: `Failed to update visibility: ${res.error || 'Unknown error'}`, type: 'error' });
      setTimeout(() => setModalMessage(null), 3000);
    }
  };

  const printableWishes = allWishes.slice(0, 8);
  const printSlots = Array.from({ length: 8 }, (_, index) => printableWishes[index] || null);

  if (loading) {
    return <div className={styles.wishesInner}>Loading wishes...</div>;
  }

  if (!user) {
    return (
      <div className={styles.wishesInner}>
        <h1>Admin Wishes</h1>
        <p>Please sign in to view and manage wishes.</p>
      </div>
    );
  }

  return (
    <main>
      <div className={styles.wishesPageContainer}>
        <div className={styles.wishesBg}></div>

        <div className={styles.wishesInner}>
          <div className={styles.wishesHeader}>
            <h1 className={styles.wishesTitle}>Admin Wishes</h1>
            <p className={styles.wishCount}>Manage wish visibility and download the A4 print sheet.</p>
          </div>

          <div className={styles.adminSection}>
            <div className={styles.adminSectionHeader}>
              <div>
                <h2>Wishes Management</h2>
                <p className={styles.adminSectionNote}>
                  Download an admin-only A4 wish sheet with the latest 8 wishes and signature lines.
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
                {allWishes.map((wish) => (
                  <li key={wish.id} className={styles.adminItem}>
                    <div>
                      <strong>{wish.guest_name}</strong> ({wish.guest_phone})
                      <p>{wish.wish_text}</p>
                      <small>{new Date(wish.submitted_at).toLocaleString()}</small>
                    </div>
                    <button
                      className={wish.is_visible ? styles.hideBtn : styles.showBtn}
                      onClick={() => toggleVisibility(wish.id, !!wish.is_visible)}
                    >
                      {wish.is_visible ? 'Hide from Home' : 'Show on Home'}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div id="wish-print-sheet" className={styles.printSheet}>
            <div className={styles.printHeader}>
              <h1>{config.child.name}'s Birthday Wishes</h1>
              <p>Happy birthday {config.child.name}! Use this sheet to print the latest wishes and collect signatures.</p>
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
      </div>
    </main>
  );
}
