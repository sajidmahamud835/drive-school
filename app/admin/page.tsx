'use client';

import { useState, useEffect } from 'react';
import BookingList from '@/components/admin/BookingList';
import { Booking } from '@/types';

export default function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // TODO: Fetch bookings from API in Phase 2
    // For now, using empty array
    setBookings([]);
  }, []);

  const handleConfirm = async (bookingId: string) => {
    setLoading(true);
    // TODO: Call API to confirm booking in Phase 2
    console.log('Confirming booking:', bookingId);
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'confirmed' as const } : b))
    );
    setLoading(false);
  };

  const handleReject = async (bookingId: string) => {
    setLoading(true);
    // TODO: Call API to reject booking in Phase 2
    console.log('Rejecting booking:', bookingId);
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'rejected' as const } : b))
    );
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Pending Bookings</h2>
            <BookingList
              bookings={bookings.filter((b) => b.status === 'pending')}
              onConfirm={handleConfirm}
              onReject={handleReject}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
