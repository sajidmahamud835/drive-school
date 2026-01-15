'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import BookingList from '@/components/admin/BookingList';
import BookingDetailModal from '@/components/admin/BookingDetailModal';
import Button from '@/components/ui/Button';
import { Booking, User } from '@/types';

export default function AdminPage() {
  const { user, getIdToken } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'rejected'>('pending');
  const [error, setError] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchStudentId, setSearchStudentId] = useState<string>('');
  const [searchResult, setSearchResult] = useState<User | null>(null);

  const fetchBookings = async (status?: string) => {
    if (!user) {
      setError('অনুগ্রহ করে প্রথমে সাইন ইন করুন');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const idToken = await getIdToken();
      if (!idToken) {
        throw new Error('Authentication token not available');
      }

      const statusParam = status && status !== 'all' ? `?status=${status}` : '';
      const response = await fetch(`/api/admin/bookings${statusParam}`, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'বুকিং লোড করতে সমস্যা হয়েছে');
      }

      setBookings(data.bookings || []);
    } catch (error: any) {
      console.error('Fetch bookings error:', error);
      setError(error.message || 'বুকিং লোড করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookings(filter);
    }
  }, [filter, user]);

  const handleSearchStudent = async () => {
    if (!searchStudentId.trim() || !user) return;

    setLoading(true);
    setError(null);

    try {
      const idToken = await getIdToken();
      if (!idToken) {
        throw new Error('Authentication token not available');
      }

      const response = await fetch(`/api/admin/search-student?studentId=${encodeURIComponent(searchStudentId)}`, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'স্টুডেন্ট খুঁজে পাওয়া যায়নি');
      }

      setSearchResult(data.user);
    } catch (error: any) {
      console.error('Search student error:', error);
      setError(error.message || 'স্টুডেন্ট খুঁজে পাওয়া যায়নি');
      setSearchResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (data: {
    bookingId: string;
    assignedPackage: '15-days' | '1-month' | 'old-student';
    fee?: number;
    totalPaid?: number;
  }) => {
    if (!user) {
      setError('অনুগ্রহ করে প্রথমে সাইন ইন করুন');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const idToken = await getIdToken();
      if (!idToken) {
        throw new Error('Authentication token not available');
      }

      const response = await fetch('/api/admin/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          bookingId: data.bookingId,
          action: 'confirm',
          assignedPackage: data.assignedPackage,
          fee: data.fee,
          totalPaid: data.totalPaid,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'বুকিং নিশ্চিত করতে সমস্যা হয়েছে');
      }

      // Refresh bookings
      await fetchBookings(filter);
      setSelectedBooking(null);
      setSelectedUser(null);
    } catch (error: any) {
      console.error('Confirm booking error:', error);
      setError(error.message || 'বুকিং নিশ্চিত করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (bookingId: string) => {
    if (!user) {
      setError('অনুগ্রহ করে প্রথমে সাইন ইন করুন');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const idToken = await getIdToken();
      if (!idToken) {
        throw new Error('Authentication token not available');
      }

      const response = await fetch('/api/admin/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          bookingId,
          action: 'reject',
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'বুকিং প্রত্যাখ্যান করতে সমস্যা হয়েছে');
      }

      // Refresh bookings
      await fetchBookings(filter);
      setSelectedBooking(null);
      setSelectedUser(null);
    } catch (error: any) {
      console.error('Reject booking error:', error);
      setError(error.message || 'বুকিং প্রত্যাখ্যান করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteStudent = async (studentId: string) => {
    if (!user) {
      setError('অনুগ্রহ করে প্রথমে সাইন ইন করুন');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const idToken = await getIdToken();
      if (!idToken) {
        throw new Error('Authentication token not available');
      }

      const response = await fetch('/api/admin/complete-student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({ studentId }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'স্টুডেন্ট সম্পন্ন করতে সমস্যা হয়েছে');
      }

      // Update selected user
      if (selectedUser && selectedUser.studentId === studentId) {
        setSelectedUser({
          ...selectedUser,
          status: 'completed',
          certificateId: data.user.certificateId,
          certificateLink: data.user.certificateLink,
          completionDate: data.user.completionDate,
        });
      }

      alert(`স্টুডেন্ট সম্পন্ন হয়েছে!\nসার্টিফিকেট লিঙ্ক: ${data.user.certificateLink}`);
    } catch (error: any) {
      console.error('Complete student error:', error);
      setError(error.message || 'স্টুডেন্ট সম্পন্ন করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateFee = async (data: {
    bookingId: string;
    fee?: number;
    totalPaid?: number;
    paymentAmount?: number;
    paymentMethod?: 'cash' | 'bank' | 'other';
    paymentNotes?: string;
  }) => {
    if (!user) {
      setError('অনুগ্রহ করে প্রথমে সাইন ইন করুন');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const idToken = await getIdToken();
      if (!idToken) {
        throw new Error('Authentication token not available');
      }

      // Find the booking to get current totalPaid
      const currentBooking = bookings.find(b => b.id === data.bookingId);
      
      // Calculate new total paid if adding payment
      let newTotalPaid = data.totalPaid || currentBooking?.totalPaid || 0;
      if (data.paymentAmount && data.paymentAmount > 0) {
        newTotalPaid = (currentBooking?.totalPaid || 0) + data.paymentAmount;
      }

      const response = await fetch('/api/admin/update-booking', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          bookingId: data.bookingId,
          fee: data.fee,
          totalPaid: newTotalPaid,
          payment: data.paymentAmount ? {
            amount: data.paymentAmount,
            method: data.paymentMethod,
            notes: data.paymentNotes,
            date: new Date(),
          } : undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'ফি আপডেট করতে সমস্যা হয়েছে');
      }

      // Refresh bookings
      await fetchBookings(filter);
      if (selectedBooking && selectedBooking.id === data.bookingId) {
        setSelectedBooking({
          ...selectedBooking,
          fee: result.booking.fee,
          totalPaid: result.booking.totalPaid,
          due: result.booking.due,
          payments: result.booking.payments,
        });
      }
    } catch (error: any) {
      console.error('Update fee error:', error);
      setError(error.message || 'ফি আপডেট করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingClick = async (booking: Booking) => {
    setSelectedBooking(booking);
    setSelectedUser(null);
    
    // Fetch user data by firebaseUid
    if (booking.userFirebaseUid && user) {
      try {
        const idToken = await getIdToken();
        if (!idToken) return;

        // Try to find user by searching bookings for studentId
        // For now, we'll fetch from the user's profile API if we have their UID
        // We need to create an admin endpoint to get user by firebaseUid
        const userResponse = await fetch(`/api/admin/user-by-uid?uid=${booking.userFirebaseUid}`, {
          headers: {
            'Authorization': `Bearer ${idToken}`,
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          if (userData.success) {
            setSelectedUser(userData.user);
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    }
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
            
            {/* Search Student by ID */}
            <div className="mt-6 p-4 bg-white rounded-xl shadow-lg border-2 border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3">স্টুডেন্ট খুঁজুন</h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={searchStudentId}
                  onChange={(e) => setSearchStudentId(e.target.value)}
                  placeholder="স্টুডেন্ট আইডি দিন (যেমন: TS25001)"
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-tinder focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearchStudent()}
                />
                <Button
                  variant="primary"
                  onClick={handleSearchStudent}
                  disabled={loading || !searchStudentId.trim()}
                >
                  খুঁজুন
                </Button>
              </div>
              {searchResult && (
                <div className="mt-4 p-4 bg-green-50 border-2 border-green-300 rounded-xl">
                  <p className="font-bold text-green-800 mb-2">স্টুডেন্ট পাওয়া গেছে:</p>
                  <p className="text-green-700">
                    <span className="font-bold">নাম:</span> {searchResult.name} | 
                    <span className="font-bold ml-2">স্ট্যাটাস:</span> {searchResult.status} |
                    {searchResult.certificateLink && (
                      <span className="ml-2">
                        <span className="font-bold">সার্টিফিকেট:</span> 
                        <a href={searchResult.certificateLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline ml-1">
                          {searchResult.certificateLink}
                        </a>
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>
            {error && (
              <div className="mt-4 p-4 bg-red-50 border-2 border-red-300 rounded-xl">
                <p className="text-red-800 font-medium">{error}</p>
              </div>
            )}
            {!user && (
              <div className="mt-4 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-xl">
                <p className="text-yellow-800 font-medium">⚠️ অনুগ্রহ করে প্রথমে সাইন ইন করুন</p>
              </div>
            )}
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
              onConfirm={(id) => {
                const booking = filteredBookings.find(b => b.id === id);
                if (booking) {
                  handleBookingClick(booking);
                }
              }}
              onReject={handleReject}
              onBookingClick={handleBookingClick}
              loading={loading}
            />
            
            {selectedBooking && (
              <BookingDetailModal
                booking={selectedBooking}
                user={selectedUser}
                onClose={() => {
                  setSelectedBooking(null);
                  setSelectedUser(null);
                }}
                onConfirm={handleConfirm}
                onReject={handleReject}
                onCompleteStudent={handleCompleteStudent}
                onUpdateFee={handleUpdateFee}
                loading={loading}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
