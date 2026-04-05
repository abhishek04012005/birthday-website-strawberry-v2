'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import styles from '../styles/AdminNavbar.module.css';

const AdminNavbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const searchParams = useSearchParams();
  const activeQuizParam = searchParams?.get('tab') === 'quiz';

  const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/admin/guest-management', label: 'Guest Management' },
    { href: '/admin/guest-management?tab=quiz', label: 'Quiz' },
    { href: '/admin/gallery-management', label: 'Gallery Management' },
    { href: '/admin/photos-videos', label: 'Photos & Videos' },
    { href: '/wishes', label: 'Wishes' },
  ];

  const isActive = (href: string) => {
    if (href === '/admin/guest-management?tab=quiz') {
      return pathname.startsWith('/admin/guest-management') && activeQuizParam;
    }
    if (href === '/admin/guest-management') {
      return pathname.startsWith('/admin/guest-management') && !activeQuizParam;
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

        <nav className={styles.navLinks} aria-label="Admin navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navLink} ${isActive(item.href) ? styles.active : ''}`}
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