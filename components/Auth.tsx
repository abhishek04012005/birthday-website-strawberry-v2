'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/Auth.module.css';

const Auth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/verify-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Welcome! Redirecting to dashboard...');
        // Store login session in localStorage
        localStorage.setItem('adminSession', JSON.stringify({
          id: data.user.id,
          email: data.user.email,
          timestamp: new Date().toISOString(),
        }));
        setTimeout(() => router.push('/dashboard'), 1800);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authBgGradient}></div>

      <div className={styles.authContent}>
        {/* Left Section - Branding */}
        <div className={styles.authBrand}>
          <div className={styles.brandEmoji}>🍓</div>
          <h1 className={styles.brandTitle}>Emma's</h1>
          <h2 className={styles.brandSubtitle}>Birthday Party</h2>
          <p className={styles.brandTagline}>Admin Access Portal</p>
          
          <div className={styles.brandFeatures}>
            <div className={styles.feature}>
              <span>📊</span> View RSVPs
            </div>
            <div className={styles.feature}>
              <span>💌</span> Manage Wishes
            </div>
            <div className={styles.feature}>
              <span>🎉</span> Party Details
            </div>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className={styles.authCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Admin Login</h2>
            <p className={styles.cardDesc}>Secure access to party management</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.authForm}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email Address</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>📧</span>
                <input
                  type="email"
                  placeholder="admin@birthday.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Password</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>🔐</span>
                <input
                  type="password"
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className={styles.input}
                />
              </div>
            </div>

            {error && (
              <div className={styles.alertError}>
                <span>⚠️</span> {error}
              </div>
            )}

            {success && (
              <div className={styles.alertSuccess}>
                <span>✅</span> {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={styles.submitBtn}
            >
              {loading ? (
                <>
                  <span className={styles.spinner}></span>
                  Signing in...
                </>
              ) : (
                <>
                  🎉 Sign In to Dashboard
                </>
              )}
            </button>
          </form>

          <div className={styles.cardFooter}>
            <p>Need help? Contact the host for credentials.</p>
          </div>
        </div>
      </div>

      {/* Floating decorations */}
      <div className={styles.floatingDecorations}>
        <div className={styles.decoration}>🎈</div>
        <div className={styles.decoration}>🎂</div>
        <div className={styles.decoration}>🎁</div>
        <div className={styles.decoration}>✨</div>
      </div>
    </div>
  );
};

export default Auth;

