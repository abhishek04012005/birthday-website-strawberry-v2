'use client';

import Auth from '@/components/Auth';
import styles from '@/styles/Auth.module.css';

export default function AuthPage() {
  return (
    <div className={styles.authContainer}>
      <div className={styles.authBg}></div>
      <div className={styles.authCard}>
        <Auth />
      </div>
    </div>
  );
}
