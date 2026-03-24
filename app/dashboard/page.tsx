'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getRSVPs, getWishes } from '@/lib/supabase';
import styles from '@/styles/Dashboard.module.css';

interface RSVP {
  id: string;
  child_name: string;
  guest_name: string;
  attending: boolean;
  guest_count: number;
  phone: string;
  email: string;
  submitted_at: string;
}

interface Wish {
  id: string;
  child_name: string;
  guest_name: string;
  wish_text: string;
  submitted_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'rsvps' | 'wishes'>('rsvps');

  useEffect(() => {
    const checkAuth = async () => {
      // Check localStorage for admin session
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

        // Fetch RSVPs and Wishes with default child name
        const rsvpResult = await getRSVPs('Emma');
        const wishResult = await getWishes('Emma');

        setRsvps(rsvpResult?.data || []);
        setWishes(wishResult?.data || []);
        setLoading(false);
      } catch (err) {
        console.error('Session error:', err);
        localStorage.removeItem('adminSession');
        router.push('/auth');
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    localStorage.removeItem('adminSession');
    router.push('/auth');
  };

  if (loading) {
    return (
      <div className={styles.dashboardContainer}>
        <div className={styles.loadingSpinner}>
          <div className={styles.spinner}></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const attendingCount = rsvps.filter(r => r.attending).length;
  const totalGuests = rsvps.reduce((sum, r) => sum + r.guest_count, 0);

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardBg}></div>

      {/* Header */}
      <header className={styles.dashboardHeader}>
        <div className={styles.headerContent}>
          <div>
            <h1 className={styles.headerTitle}>🎉 Party Dashboard</h1>
            <p className={styles.headerSubtitle}>
              Welcome back, {user.childName}!
            </p>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Stats Section */}
      <section className={styles.statsSection}>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{rsvps.length}</div>
          <div className={styles.statLabel}>Total Responses</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{attendingCount}</div>
          <div className={styles.statLabel}>Attending</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{totalGuests}</div>
          <div className={styles.statLabel}>Total Guests</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{wishes.length}</div>
          <div className={styles.statLabel}>Birthday Wishes</div>
        </div>
      </section>

      {/* Tabs */}
      <div className={styles.tabContainer}>
        <button
          className={`${styles.tabBtn} ${activeTab === 'rsvps' ? styles.active : ''}`}
          onClick={() => setActiveTab('rsvps')}
        >
          👥 RSVPs ({rsvps.length})
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'wishes' ? styles.active : ''}`}
          onClick={() => setActiveTab('wishes')}
        >
          🎈 Wishes ({wishes.length})
        </button>
      </div>

      {/* Content */}
      <main className={styles.contentArea}>
        {activeTab === 'rsvps' && (
          <div className={styles.rsvpsSection}>
            {rsvps.length === 0 ? (
              <div className={styles.emptyState}>
                <p className={styles.emptyIcon}>📋</p>
                <p className={styles.emptyText}>No RSVPs yet!</p>
              </div>
            ) : (
              <div className={styles.rsvpsList}>
                {rsvps.map((rsvp) => (
                  <div
                    key={rsvp.id}
                    className={`${styles.rsvpCard} ${
                      rsvp.attending ? styles.rsvpAttending : styles.rsvpNotAttending
                    }`}
                  >
                    <div className={styles.rsvpHeader}>
                      <h3>{rsvp.guest_name}</h3>
                      <span className={styles.rsvpStatus}>
                        {rsvp.attending ? '✓ Attending' : '✗ Not Attending'}
                      </span>
                    </div>
                    <div className={styles.rsvpDetails}>
                      <p>
                        <strong>Guests:</strong> {rsvp.guest_count}
                      </p>
                      <p>
                        <strong>Phone:</strong>{' '}
                        <a href={`tel:${rsvp.phone}`}>{rsvp.phone}</a>
                      </p>
                      <p>
                        <strong>Email:</strong>{' '}
                        <a href={`mailto:${rsvp.email}`}>{rsvp.email}</a>
                      </p>
                      <p className={styles.date}>
                        {new Date(rsvp.submitted_at).toLocaleDateString()} at{' '}
                        {new Date(rsvp.submitted_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'wishes' && (
          <div className={styles.wishesSection}>
            {wishes.length === 0 ? (
              <div className={styles.emptyState}>
                <p className={styles.emptyIcon}>🎁</p>
                <p className={styles.emptyText}>No wishes yet!</p>
              </div>
            ) : (
              <div className={styles.wishesList}>
                {wishes.map((wish) => (
                  <div key={wish.id} className={styles.wishCard}>
                    <div className={styles.wishHeader}>
                      <h4>{wish.guest_name}</h4>
                      <span className={styles.wishDate}>
                        {new Date(wish.submitted_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className={styles.wishText}>{wish.wish_text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Bottom Action Buttons */}
      <div className={styles.bottomActionBar}>
        <a
          href="https://wa.me/919285248504?text=Hi%20Emma%2C%20I%20just%20RSVP%20for%20your%20birthday!"
          target="_blank"
          rel="noreferrer"
          className={styles.actionBtn}
          title="WhatsApp"
        >
          💬
        </a>
        <a
          href="/#rsvp"
          className={styles.actionBtnSecondary}
          title="RSVP"
        >
          📝
        </a>
      </div>
    </div>
  );
}
