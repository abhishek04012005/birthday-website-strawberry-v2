'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from '../styles/AdminNavbar.module.css';

const AdminNavbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    // { href: '/admin/wishes', label: 'Wishes' },
    { href: '/admin/guest-management', label: 'Guest Management' },
    // { href: '/admin/quiz-settings', label: 'Quiz Settings' },
    { href: '/admin/quiz-dashboard', label: 'Quiz Dashboard' },
    { href: '/admin/photos-videos', label: 'Photos & Videos' },
  ];

  const isActive = (href: string) => {
    if (href === '/admin/guest-management') {
      return pathname.startsWith('/admin/guest-management');
    }
    return pathname === href;
  };

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    router.push('/auth');
  };

  return (
    <header className={styles.adminNavbar}>
      <div className={styles.container}>
        <Link href="/dashboard" className={styles.brand}>
          <span className={styles.brandBadge}>🎉</span>
          <span>Admin Panel</span>
        </Link>

        <button
          type="button"
          className={styles.mobileToggle}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        <nav className={`${styles.navLinks} ${menuOpen ? styles.open : ''}`} aria-label="Admin navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navLink} ${isActive(item.href) ? styles.active : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default AdminNavbar;