'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    if (user && !authLoading) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signIn(email, password);
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'লগইনে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Google login error:', error);
      setError(error.message || 'Google দিয়ে লগইনে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setGoogleLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-red-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tinder mx-auto"></div>
          <p className="mt-4 text-gray-600">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-red-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-4xl font-extrabold text-gray-900">
            <span className="text-tinder">লগইন</span> করুন
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            অথবা{' '}
            <Link href="/booking" className="font-medium text-tinder hover:text-red-600">
              নতুন অ্যাকাউন্ট তৈরি করুন
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-4 bg-red-50 border-2 border-red-300 rounded-xl">
              <p className="text-red-800 font-medium text-sm">{error}</p>
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                ইমেইল
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-4 py-4 border-2 border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-tinder focus:border-tinder focus:z-10 sm:text-lg"
                placeholder="ইমেইল ঠিকানা"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                পাসওয়ার্ড
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-4 py-4 border-2 border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-tinder focus:border-tinder focus:z-10 sm:text-lg"
                placeholder="পাসওয়ার্ড"
              />
            </div>
          </div>

          <div className="space-y-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full bg-tinder hover:bg-red-600 text-white font-bold py-4 rounded-xl shadow-tinder transform transition-all hover:scale-105 active:scale-95 text-lg"
              disabled={loading || googleLoading}
            >
              {loading ? 'লগইন হচ্ছে...' : 'লগইন করুন'}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">অথবা</span>
              </div>
            </div>

            {/* Google Sign In Button */}
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={handleGoogleSignIn}
              disabled={loading || googleLoading}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 font-bold py-4 rounded-xl border-2 border-gray-300 shadow-md transform transition-all hover:scale-105 active:scale-95 text-lg flex items-center justify-center gap-3"
            >
              {googleLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700"></div>
                  <span>লগইন হচ্ছে...</span>
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Google দিয়ে লগইন করুন</span>
                </>
              )}
            </Button>
          </div>

          <div className="text-center">
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-tinder font-medium"
            >
              ← হোমপেজে ফিরে যান
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
