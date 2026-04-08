import type { Metadata } from 'next';
import AuthClient from './AuthClient';

export const metadata: Metadata = {
  title: 'Admin Login - Birthday Party Management',
  description: 'Secure admin login for birthday party management system.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function AuthPage() {
  return <AuthClient />;
}
