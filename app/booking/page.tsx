'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import PackageSelector from '@/components/booking/PackageSelector';
import BookingForm from '@/components/booking/BookingForm';
import TimeSlotPicker from '@/components/booking/TimeSlotPicker';
import BookingConfirmation from '@/components/booking/BookingConfirmation';
import { Package, Booking } from '@/types';

const packages: Package[] = [
  {
    id: '15-days',
    name: '১৫ দিনের প্যাকেজ',
    duration: '15 days',
    price: 0,
    description: 'দ্রুত শেখার জন্য পারফেক্ট',
    features: [
      '১৫ দিনের ইন্টেনসিভ ট্রেনিং',
      'লক্ষ্য অনুযায়ী সিডিউল',
      'রোড টেস্ট প্রস্তুতি',
      'সার্টিফিকেট অফ কমপ্লিশন',
    ],
    isActive: true,
  },
  {
    id: '1-month',
    name: 'এক মাসের প্যাকেজ',
    duration: '1 month',
    price: 0,
    description: 'ব্যাপক প্রশিক্ষণ প্রোগ্রাম',
    features: [
      '৩০ দিনের স্ট্রাকচার্ড ট্রেনিং',
      'থিওরি ও প্র্যাকটিক্যাল লেসন',
      'হাইওয়ে ড্রাইভিং এক্সপেরিয়েন্স',
      'পার্কিং টেকনিক',
      'রোড টেস্ট প্রস্তুতি',
    ],
    isActive: true,
  },
  {
    id: 'pay-as-you-go',
    name: 'পে অ্যাজ ইউ গো',
    duration: 'Flexible',
    price: 0,
    description: 'অতিরিক্ত অনুশীলনের জন্য',
    note: 'শুধুমাত্র সম্পূর্ণ কোর্স সম্পন্নকারী শিক্ষার্থীদের জন্য',
    features: [
      'লক্ষ্য অনুযায়ী সিডিউল',
      'সেশন প্রতি পেমেন্ট',
      'নির্দিষ্ট স্কিল প্র্যাকটিস',
      'দীর্ঘমেয়াদী কমিটমেন্ট নেই',
      'সম্পূর্ণ কোর্স সম্পন্নকারীদের জন্য',
    ],
    isActive: true,
  },
];

type BookingStep = 'package' | 'auth-method' | 'auth' | 'time' | 'confirmation';

function BookingPageContent() {
  const searchParams = useSearchParams();
  const initialPackageId = searchParams.get('package');
  const { user, getIdToken, signInWithGoogle } = useAuth();
  
  const [step, setStep] = useState<BookingStep>('package');
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(
    initialPackageId ? packages.find((p) => p.id === initialPackageId) || null : null
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<{
    email: string;
    phone: string;
    name: string;
    age: number;
    gender: 'male' | 'female' | 'other';
    whyLearning: 'going-abroad' | 'interest-hobby' | 'work-career' | 'others';
    address: string;
    previousTraining: 'yes' | 'no';
    password?: string;
  } | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePackageSelect = (pkg: Package) => {
    setSelectedPackage(pkg);
  };

  const handleContinue = () => {
    if (selectedPackage) {
      setStep('auth-method');
    }
  };

  const handleAuthSubmit = async (data: {
    email: string;
    phone: string;
    name: string;
    age: number;
    whyLearning: 'going-abroad' | 'interest-hobby' | 'work-career' | 'others';
    address: string;
    previousTraining: 'yes' | 'no';
    password?: string;
  }) => {
    setUserInfo(data);
    setStep('time');
    // TODO: Implement Firebase Auth in Phase 2
  };

  const handleAuthMethodSelect = async (method: 'google' | 'manual') => {
    if (method === 'google') {
      try {
        setLoading(true);
        setError(null);
        await signInWithGoogle();
        // After Google auth, proceed to form
        setStep('auth');
      } catch (error: any) {
        console.error('Google auth error:', error);
        setError(error.message || 'Google দিয়ে সাইন ইন করতে সমস্যা হয়েছে');
      } finally {
        setLoading(false);
      }
    } else {
      setStep('auth');
    }
  };

  const handleTimeSelect = async () => {
    if (selectedDate && selectedTime && selectedPackage && userInfo) {
      if (!user) {
        setError('অনুগ্রহ করে প্রথমে সাইন ইন করুন');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log('[Booking Page] Getting Firebase ID token...');
        const idToken = await getIdToken();
        if (!idToken) {
          console.error('[Booking Page] No ID token available');
          throw new Error('Authentication token not available');
        }
        console.log('[Booking Page] ID token obtained');

        const requestBody = {
          packageId: selectedPackage.id,
          selectedDate: selectedDate.toISOString(),
          selectedTime,
          phone: userInfo.phone,
          email: userInfo.email,
          name: userInfo.name,
          age: userInfo.age,
          gender: userInfo.gender,
          whyLearning: userInfo.whyLearning,
          address: userInfo.address,
          previousTraining: userInfo.previousTraining,
        };
        
        console.log('[Booking Page] Making API request to /api/booking/create');
        console.log('[Booking Page] Request body:', {
          ...requestBody,
          phone: requestBody.phone ? '***' : undefined,
        });

        const response = await fetch('/api/booking/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
          },
          body: JSON.stringify(requestBody),
        });

        console.log('[Booking Page] API response status:', response.status);
        console.log('[Booking Page] API response ok:', response.ok);

        const data = await response.json();
        console.log('[Booking Page] API response data:', {
          success: data.success,
          error: data.error,
          bookingId: data.booking?.id,
        });

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'বুকিং তৈরি করতে সমস্যা হয়েছে');
        }

        const newBooking: Booking = {
          id: data.booking.id,
          userFirebaseUid: user.uid,
          packageId: data.booking.packageId,
          selectedDate: data.booking.selectedDate,
          selectedTime: data.booking.selectedTime,
          status: data.booking.status as 'pending' | 'confirmed' | 'rejected',
          phone: userInfo.phone,
          email: userInfo.email,
          name: userInfo.name,
          age: userInfo.age,
          whyLearning: userInfo.whyLearning,
          address: userInfo.address,
          previousTraining: userInfo.previousTraining === 'yes',
        };
        
        // Store studentId for confirmation page
        if (data.studentId) {
          setStudentId(data.studentId);
        }

        // Set booking and navigate to confirmation
        console.log('Setting booking:', newBooking);
        setBooking(newBooking);
        setError(null);
        console.log('Setting step to confirmation');
        setStep('confirmation');
        
        // Scroll to top to show confirmation
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
      } catch (error: any) {
        console.error('[Booking Page] Booking creation error:', error);
        console.error('[Booking Page] Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name,
        });
        const errorMessage = error.message || 'বুকিং তৈরি করতে সমস্যা হয়েছে';
        setError(errorMessage);
        setLoading(false);
      }
    } else {
      setError('অনুগ্রহ করে সব তথ্য পূরণ করুন');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {step === 'package' && (
          <PackageSelector
            packages={packages}
            selectedPackage={selectedPackage}
            onSelect={handlePackageSelect}
            onContinue={handleContinue}
          />
        )}
        {step === 'auth-method' && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-center text-gray-900">
              সাইন ইন করুন
            </h2>
            <p className="text-center text-gray-600 mb-8 text-lg">
              আপনার অ্যাকাউন্ট তৈরি করুন বা সাইন ইন করুন
            </p>
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 rounded-xl">
                <p className="text-red-800 font-medium">{error}</p>
              </div>
            )}
            <div className="space-y-4">
              <button
                onClick={() => handleAuthMethodSelect('google')}
                disabled={loading}
                className="w-full px-8 py-5 bg-white border-3 border-gray-300 hover:border-tinder text-gray-800 rounded-xl hover:bg-pink-50 font-bold text-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-md"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google দিয়ে চালিয়ে যান
              </button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gray-50 text-gray-500 font-medium">অথবা</span>
                </div>
              </div>
              <button
                onClick={() => handleAuthMethodSelect('manual')}
                disabled={loading}
                className="w-full px-8 py-5 bg-tinder hover:bg-red-600 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                ইমেইল/পাসওয়ার্ড দিয়ে চালিয়ে যান
              </button>
            </div>
          </div>
        )}
        {step === 'auth' && (
          <BookingForm
            onSubmit={handleAuthSubmit}
            loading={loading}
          />
        )}
        {step === 'time' && (
          <div>
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 rounded-xl max-w-2xl mx-auto">
                <p className="text-red-800 font-medium">{error}</p>
              </div>
            )}
            <TimeSlotPicker
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onDateSelect={setSelectedDate}
              onTimeSelect={setSelectedTime}
            />
            {selectedDate && selectedTime && (
              <div className="mt-10 flex justify-center">
                <button
                  onClick={handleTimeSelect}
                  className="px-12 py-5 bg-tinder hover:bg-red-600 text-white rounded-xl hover:shadow-tinder transition-all font-bold text-lg transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading || !user}
                >
                  {loading ? 'বুকিং তৈরি হচ্ছে...' : '🚗 বুকিং নিশ্চিত করুন'}
                </button>
              </div>
            )}
          </div>
        )}
        {step === 'confirmation' && (
          booking && selectedPackage ? (
            <BookingConfirmation booking={booking} packageInfo={selectedPackage} studentId={studentId || undefined} />
          ) : (
            <div className="text-center py-12">
              <p className="text-red-600 font-medium text-lg mb-4">বুকিং লোড করতে সমস্যা হয়েছে</p>
              <button
                onClick={() => setStep('time')}
                className="px-6 py-3 bg-tinder text-white rounded-xl font-bold hover:bg-red-600"
              >
                ফিরে যান
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <BookingPageContent />
    </Suspense>
  );
}
