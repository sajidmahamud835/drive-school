'use client';

import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import { format } from 'date-fns';
import Link from 'next/link';
import { Booking, Package } from '@/types';

const dayNames = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শনিবার', 'রবিবার'];
const monthNames = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];

interface BookingConfirmationProps {
  booking: Booking;
  packageInfo: Package | null;
}

export default function BookingConfirmation({ booking, packageInfo, studentId }: BookingConfirmationProps) {
  const bookingDate = booking.selectedDate ? new Date(booking.selectedDate) : null;

  const formatDateBangla = (date: Date) => {
    const day = dayNames[date.getDay()];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day}, ${month} ${date.getDate()}, ${year}`;
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">বুকিং নিশ্চিত হয়েছে!</h2>
        <p className="text-xl text-gray-700 font-medium">
          আপনার বুকিং জমা দেওয়া হয়েছে এবং নিশ্চিতকরণের জন্য অপেক্ষা করছে
        </p>
      </div>

      <Card className="mb-8 border-2 border-gray-200 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-tinder/10 to-red-50 rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-gray-900">বুকিং বিবরণ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-8">
          <div>
            <p className="text-base font-bold text-gray-600 mb-2">প্যাকেজ</p>
            <p className="text-xl font-bold text-gray-900">{packageInfo?.name || 'N/A'}</p>
          </div>
          {bookingDate && (
            <div>
              <p className="text-base font-bold text-gray-600 mb-2">তারিখ</p>
              <p className="text-xl font-bold text-gray-900">{formatDateBangla(bookingDate)}</p>
            </div>
          )}
          <div>
            <p className="text-base font-bold text-gray-600 mb-2">সময়</p>
            <p className="text-xl font-bold text-gray-900">{booking.selectedTime}</p>
          </div>
          <div>
            <p className="text-base font-bold text-gray-600 mb-2">স্ট্যাটাস</p>
            <span className="inline-flex items-center px-4 py-2 rounded-full text-base font-bold bg-yellow-100 text-yellow-800 border-2 border-yellow-300">
              নিশ্চিতকরণের জন্য অপেক্ষা করছে
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="bg-gradient-to-r from-blue-50 to-pink-50 border-2 border-blue-200 rounded-2xl p-8 mb-8">
        <h3 className="font-bold text-xl mb-4 text-gray-900">এরপর কী করবেন?</h3>
        <ul className="space-y-3 text-lg text-gray-800">
          <li className="flex items-start gap-3">
            <span className="text-green-600 text-2xl font-bold">✓</span>
            <span className="font-medium">আপনি শীঘ্রই একটি নিশ্চিতকরণ ইমেইল পাবেন</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 text-2xl font-bold">✓</span>
            <span className="font-medium">আমাদের টিম আপনার বুকিং পর্যালোচনা করবে</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 text-2xl font-bold">✓</span>
            <span className="font-medium">নিশ্চিত হওয়ার পর আপনি মিলনস্থলের ঠিকানা পাবেন</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 text-2xl font-bold">✓</span>
            <span className="font-medium">অনুগ্রহ করে আপনার লেসনের জন্য সময়মতো আসুন</span>
          </li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/" className="w-full sm:w-auto">
          <Button variant="outline" size="lg" className="w-full border-2 border-tinder text-tinder hover:bg-pink-50 font-bold py-4 text-lg">
            হোমে ফিরে যান
          </Button>
        </Link>
        <Link href="/dashboard" className="w-full sm:w-auto">
          <Button variant="primary" size="lg" className="w-full sm:w-auto bg-tinder hover:bg-red-600 text-white font-bold py-4 text-lg shadow-tinder">
            আমার ড্যাশবোর্ড
          </Button>
        </Link>
      </div>
    </div>
  );
}
