'use client';

import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import { format } from 'date-fns';
import { Booking } from '@/types';

const dayNames = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহ', 'শনি', 'রবি'];
const monthNames = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];

interface BookingListProps {
  bookings: Booking[];
  onConfirm: (bookingId: string) => void;
  onReject: (bookingId: string) => void;
  loading?: boolean;
}

const formatDateBangla = (date: Date) => {
  const day = dayNames[date.getDay()];
  const month = monthNames[date.getMonth()];
  return `${day}, ${month} ${date.getDate()}`;
};

const getStatusBadge = (status: string) => {
  const statusMap: Record<string, { text: string; className: string }> = {
    pending: { text: 'নিশ্চিতকরণের জন্য অপেক্ষা', className: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
    confirmed: { text: 'নিশ্চিত', className: 'bg-green-100 text-green-800 border-green-300' },
    rejected: { text: 'প্রত্যাখ্যাত', className: 'bg-red-100 text-red-800 border-red-300' },
  };
  return statusMap[status] || statusMap.pending;
};

export default function BookingList({ bookings, onConfirm, onReject, loading = false }: BookingListProps) {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border-2 border-gray-200">
        <div className="text-6xl mb-4">📋</div>
        <p className="text-xl text-gray-600 font-medium">কোন অপেক্ষমান বুকিং নেই</p>
        <p className="text-base text-gray-500 mt-2">সব বুকিং প্রক্রিয়াকরণ করা হয়েছে</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {bookings.map((booking) => {
        const bookingDate = booking.selectedDate ? new Date(booking.selectedDate) : null;
        const statusBadge = getStatusBadge(booking.status);
        
        return (
          <Card key={booking.id} className="border-2 border-gray-200 hover:border-tinder transition-all shadow-lg">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">বুকিং #{booking.id?.slice(-8)}</h3>
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-base font-bold border-2 ${statusBadge.className}`}>
                      {statusBadge.text}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base">
                    <div>
                      <p className="font-bold text-gray-700 mb-1">নাম</p>
                      <p className="text-gray-900 font-semibold text-lg">{booking.name}</p>
                    </div>
                    <div>
                      <p className="font-bold text-gray-700 mb-1">ইমেইল</p>
                      <p className="text-gray-900 font-semibold">{booking.email || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="font-bold text-gray-700 mb-1">ফোন</p>
                      <p className="text-gray-900 font-semibold text-lg">{booking.phone}</p>
                    </div>
                    <div>
                      <p className="font-bold text-gray-700 mb-1">বয়স</p>
                      <p className="text-gray-900 font-semibold">{booking.age} বছর</p>
                    </div>
                    {bookingDate && (
                      <div>
                        <p className="font-bold text-gray-700 mb-1">তারিখ</p>
                        <p className="text-gray-900 font-semibold text-lg">{formatDateBangla(bookingDate)}</p>
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-gray-700 mb-1">সময়</p>
                      <p className="text-gray-900 font-semibold text-lg">{booking.selectedTime}</p>
                    </div>
                    <div>
                      <p className="font-bold text-gray-700 mb-1">ঠিকানা</p>
                      <p className="text-gray-900 font-semibold">{booking.address}</p>
                    </div>
                    <div>
                      <p className="font-bold text-gray-700 mb-1">আগের প্রশিক্ষণ</p>
                      <p className="text-gray-900 font-semibold">{booking.previousTraining ? 'হ্যাঁ' : 'না'}</p>
                    </div>
                    {booking.whyLearning && (
                      <div className="md:col-span-2">
                        <p className="font-bold text-gray-700 mb-1">কেন শিখতে চান</p>
                        <p className="text-gray-900 font-medium">{booking.whyLearning}</p>
                      </div>
                    )}
                  </div>
                </div>
                {booking.status === 'pending' && (
                  <div className="flex flex-col gap-3 md:min-w-[200px]">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={() => booking.id && onConfirm(booking.id)}
                      disabled={loading}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 text-lg shadow-lg"
                    >
                      ✓ নিশ্চিত করুন
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => booking.id && onReject(booking.id)}
                      disabled={loading}
                      className="border-2 border-red-500 text-red-600 hover:bg-red-50 font-bold py-4 text-lg"
                    >
                      ✗ প্রত্যাখ্যান করুন
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
