'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import PackageSelector from '@/components/booking/PackageSelector';
import BookingForm from '@/components/booking/BookingForm';
import TimeSlotPicker from '@/components/booking/TimeSlotPicker';
import BookingConfirmation from '@/components/booking/BookingConfirmation';
import { Package, Booking } from '@/types';

const packages: Package[] = [
  {
    id: '15-days',
    name: '15 Days Package',
    duration: '15 days',
    price: 0,
    description: 'Perfect for quick learners who want to get on the road fast',
    features: [
      '15 days of intensive training',
      'Flexible scheduling',
      'Road test preparation',
      'Certificate of completion',
    ],
    isActive: true,
  },
  {
    id: '1-month',
    name: '1 Month Package',
    duration: '1 month',
    price: 0,
    description: 'Comprehensive training program for confident driving',
    features: [
      '30 days of structured training',
      'Theory and practical lessons',
      'Highway driving experience',
      'Parking techniques',
      'Road test preparation',
    ],
    isActive: true,
  },
  {
    id: 'pay-as-you-go',
    name: 'Pay As You Go',
    duration: 'Flexible',
    price: 0,
    description: 'For students who want to practice after completing their course',
    features: [
      'Flexible scheduling',
      'Pay per session',
      'Practice specific skills',
      'No long-term commitment',
    ],
    isActive: true,
  },
];

type BookingStep = 'package' | 'auth' | 'time' | 'confirmation';

function BookingPageContent() {
  const searchParams = useSearchParams();
  const initialPackageId = searchParams.get('package');
  
  const [step, setStep] = useState<BookingStep>('package');
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(
    initialPackageId ? packages.find((p) => p.id === initialPackageId) || null : null
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<{ email: string; phone: string } | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePackageSelect = (pkg: Package) => {
    setSelectedPackage(pkg);
  };

  const handleContinue = () => {
    if (selectedPackage) {
      setStep('auth');
    }
  };

  const handleAuthSubmit = async (data: { email: string; phone: string; password?: string }) => {
    setUserInfo({ email: data.email, phone: data.phone });
    setStep('time');
    // TODO: Implement Firebase Auth in Phase 2
  };

  const handleGoogleAuth = async () => {
    // TODO: Implement Google OAuth in Phase 2
    setStep('time');
  };

  const handleTimeSelect = async () => {
    if (selectedDate && selectedTime && selectedPackage && userInfo) {
      setLoading(true);
      // TODO: Create booking via API in Phase 2
      const newBooking: Booking = {
        userFirebaseUid: 'temp-uid', // Will be replaced with actual Firebase UID
        packageId: selectedPackage.id,
        selectedDate: selectedDate.toISOString(),
        selectedTime,
        status: 'pending',
        phone: userInfo.phone,
        email: userInfo.email,
      };
      setBooking(newBooking);
      setLoading(false);
      setStep('confirmation');
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
        {step === 'auth' && (
          <BookingForm
            onSubmit={handleAuthSubmit}
            onGoogleAuth={handleGoogleAuth}
            loading={loading}
          />
        )}
        {step === 'time' && (
          <div>
            <TimeSlotPicker
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onDateSelect={setSelectedDate}
              onTimeSelect={setSelectedTime}
            />
            {selectedDate && selectedTime && (
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleTimeSelect}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  disabled={loading}
                >
                  {loading ? 'Creating Booking...' : 'Confirm Booking'}
                </button>
              </div>
            )}
          </div>
        )}
        {step === 'confirmation' && booking && (
          <BookingConfirmation booking={booking} packageInfo={selectedPackage} />
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
