'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getRSVPs, getWishes, updateWishVisibility } from '@/lib/supabase';
import styles from '@/styles/Dashboard.module.css';
import { FlyerCard } from '@/components/FlyerCard';

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
  id: number;
  child_name: string;
  guest_name: string;
  wish_text: string;
  submitted_at: string;
  is_visible: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [selectedWishes, setSelectedWishes] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'rsvps' | 'wishes' | 'flyer'>('rsvps');
  const [modalMessage, setModalMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);

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
        const wishesData = wishResult?.data || [];
        setWishes(wishesData);
        setSelectedWishes(wishesData.filter(w => w.is_visible).map(w => w.id));
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

  const handleToggleWishVisibility = async (wishId: number, isVisible: boolean) => {
    await updateWishVisibility(wishId, !isVisible);
    // Update local state
    setWishes(wishes.map(w => 
      w.id === wishId ? { ...w, is_visible: !isVisible } : w
    ));
  };

  const handleBulkVisibilityUpdate = async () => {
    // Set all wishes to hidden first
    for (const wish of wishes) {
      if (wish.is_visible) {
        await updateWishVisibility(wish.id, false);
      }
    }
    
    // Set selected wishes to visible
    for (const wishId of selectedWishes) {
      await updateWishVisibility(wishId, true);
    }
    
    // Update local state
    setWishes(wishes.map(w => ({
      ...w,
      is_visible: selectedWishes.includes(w.id)
    })));
    
    setModalMessage({ text: 'Homepage wishes updated successfully!', type: 'success' });
    setTimeout(() => setModalMessage(null), 3000);
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
        <button
          className={`${styles.tabBtn} ${activeTab === 'flyer' ? styles.active : ''}`}
          onClick={() => setActiveTab('flyer')}
        >
          🎟 Flyer
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
                    <div className={styles.actionButtons}>
                      <a
                        href={`https://wa.me/${rsvp.phone.replace(/\D/g, '')}?text=Hi%20${rsvp.guest_name.replace(/\s/g, '%20')}%2C%20thanks%20for%20RSVPing%20for%20Emma's%20birthday!`}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.actionBtn}
                        title="WhatsApp Message"
                      >
                        💬 WhatsApp
                      </a>
                      <a
                        href={`tel:${rsvp.phone}`}
                        className={styles.actionBtn}
                        title="Call"
                      >
                        📞 Call
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'wishes' && (
          <div className={styles.wishesSection}>
            <div className={styles.wishesControls}>
              <h3>🎈 Select Wishes to Show on Homepage</h3>
              <p className={styles.wishesDescription}>
                Choose which birthday wishes should appear on the homepage. Selected wishes will be visible to all visitors.
              </p>
              <button
                className={styles.updateBtn}
                onClick={handleBulkVisibilityUpdate}
                disabled={selectedWishes.length === 0 && wishes.filter(w => w.is_visible).length === 0}
              >
                ✨ Update Homepage Wishes ({selectedWishes.length} selected)
              </button>
            </div>

            {wishes.length === 0 ? (
              <div className={styles.emptyState}>
                <p className={styles.emptyIcon}>🎁</p>
                <p className={styles.emptyText}>No wishes yet!</p>
              </div>
            ) : (
              <div className={styles.wishesList}>
                {wishes.map((wish) => (
                  <div key={wish.id} className={`${styles.wishCard} ${selectedWishes.includes(wish.id) ? styles.wishSelected : ''}`}>
                    <div className={styles.wishSelect}>
                      <input
                        type="checkbox"
                        id={`wish-${wish.id}`}
                        checked={selectedWishes.includes(wish.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedWishes([...selectedWishes, wish.id]);
                          } else {
                            setSelectedWishes(selectedWishes.filter(id => id !== wish.id));
                          }
                        }}
                      />
                      <label htmlFor={`wish-${wish.id}`} className={styles.wishCheckbox}>
                        {selectedWishes.includes(wish.id) ? '✅ Selected' : '⬜ Select'}
                      </label>
                    </div>
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

        {activeTab === 'flyer' && (
          <div className={styles.flyerSection}>
            <FlyerCard />
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

      {/* Modal Popup */}
      {modalMessage && (
        <div className={styles.modalOverlay} onClick={() => setModalMessage(null)}>
          <div className={`${styles.modal} ${styles[modalMessage.type]}`} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setModalMessage(null)}>✕</button>
            <div className={styles.modalContent}>
              <div className={styles.modalIcon}>
                {modalMessage.type === 'success' ? '✨' : '⚠️'}
              </div>
              <p className={styles.modalText}>{modalMessage.text}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
