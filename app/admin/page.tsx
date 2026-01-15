'use client';

import { useState, useEffect } from 'react';
import BookingList from '@/components/admin/BookingList';
import { Booking } from '@/types';

export default function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'rejected'>('pending');

  useEffect(() => {
    // TODO: Fetch bookings from API in Phase 2
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

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'all') return true;
    return b.status === filter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">অ্যাডমিন ড্যাশবোর্ড</h1>
            <p className="text-xl text-gray-700 font-medium">বুকিং ব্যবস্থাপনা</p>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-4 mb-8 bg-white p-2 rounded-xl shadow-lg border-2 border-gray-200">
            {[
              { key: 'pending', label: 'অপেক্ষমান', count: bookings.filter((b) => b.status === 'pending').length },
              { key: 'confirmed', label: 'নিশ্চিত', count: bookings.filter((b) => b.status === 'confirmed').length },
              { key: 'rejected', label: 'প্রত্যাখ্যাত', count: bookings.filter((b) => b.status === 'rejected').length },
              { key: 'all', label: 'সব', count: bookings.length },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as typeof filter)}
                className={`flex-1 px-6 py-3 rounded-lg font-bold text-lg transition-all ${
                  filter === tab.key
                    ? 'bg-tinder text-white shadow-tinder'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Bookings List */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              {filter === 'pending' && 'অপেক্ষমান বুকিং'}
              {filter === 'confirmed' && 'নিশ্চিত বুকিং'}
              {filter === 'rejected' && 'প্রত্যাখ্যাত বুকিং'}
              {filter === 'all' && 'সব বুকিং'}
            </h2>
            <BookingList
              bookings={filteredBookings}
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
