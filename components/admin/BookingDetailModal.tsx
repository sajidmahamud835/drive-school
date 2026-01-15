'use client';

import { useState, useEffect, useRef } from 'react';
import Button from '../ui/Button';
import { Booking, User } from '@/types';
import { generateInvoice } from '@/lib/pdfUtils';

interface BookingDetailModalProps {
  booking: Booking;
  user?: User | null;
  onClose: () => void;
  onConfirm: (data: {
    bookingId: string;
    assignedPackage: '15-days' | '1-month' | 'old-student';
    fee?: number;
    totalPaid?: number;
  }) => void;
  onReject: (bookingId: string) => void;
  onCompleteStudent?: (studentId: string) => void;
  onUpdateFee?: (data: {
    bookingId: string;
    fee?: number;
    totalPaid?: number;
    paymentAmount?: number;
    paymentMethod?: 'cash' | 'bank' | 'other';
    paymentNotes?: string;
  }) => void;
  loading?: boolean;
}

export default function BookingDetailModal({
  booking,
  user,
  onClose,
  onConfirm,
  onReject,
  onCompleteStudent,
  onUpdateFee,
  loading = false,
}: BookingDetailModalProps) {
  const [assignedPackageState, setAssignedPackage] = useState<'15-days' | '1-month' | 'old-student'>(
    (booking.assignedPackage as '15-days' | '1-month' | 'old-student') || '15-days'
  );
  const assignedPackageRef = useRef(assignedPackageState);
  const [fee, setFee] = useState<number>(booking.fee || 0);
  const [totalPaid, setTotalPaid] = useState<number>(booking.totalPaid || 0);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'bank' | 'other'>('cash');
  const [paymentNotes, setPaymentNotes] = useState<string>('');
  const [showFeeSection, setShowFeeSection] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [localUser, setLocalUser] = useState<User | null>(user || null);

  // Keep ref in sync with state
  useEffect(() => {
    assignedPackageRef.current = assignedPackageState;
  }, [assignedPackageState]);

  // Update localUser when user prop changes
  useEffect(() => {
    setLocalUser(user || null);
  }, [user]);

  // Reset state when booking changes
  useEffect(() => {
    const initialPackage = (booking.assignedPackage as '15-days' | '1-month' | 'old-student') || '15-days';
    setAssignedPackage(initialPackage);
    assignedPackageRef.current = initialPackage;
    setFee(booking.fee || 0);
    setTotalPaid(booking.totalPaid || 0);
  }, [booking.id, booking.assignedPackage, booking.fee, booking.totalPaid]);

  const due = fee - totalPaid;

  const handleConfirm = () => {
    // Get the current assignedPackage value from state or ref
    const currentPkg = assignedPackageState || assignedPackageRef.current || '15-days';
    const selectedPackage: '15-days' | '1-month' | 'old-student' = currentPkg;
    
    onConfirm({
      bookingId: booking.id!,
      assignedPackage: selectedPackage,
      fee: fee > 0 ? fee : undefined,
      totalPaid: totalPaid > 0 ? totalPaid : undefined,
    });
  };

  const handleAddPayment = () => {
    if (paymentAmount > 0 && onUpdateFee) {
      onUpdateFee({
        bookingId: booking.id!,
        fee,
        totalPaid: totalPaid + paymentAmount,
        paymentAmount,
        paymentMethod,
        paymentNotes,
      });
      setPaymentAmount(0);
      setPaymentNotes('');
      setShowPaymentForm(false);
    }
  };

  const handleUpdateFee = () => {
    if (onUpdateFee) {
      onUpdateFee({
        bookingId: booking.id!,
        fee,
        totalPaid,
      });
      setShowFeeSection(false);
    }
  };

  const bookingDate = booking.selectedDate ? new Date(booking.selectedDate) : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">বুকিং বিবরণ</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          {/* Booking Info */}
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-bold text-gray-600 mb-1">নাম</p>
                <p className="text-lg text-gray-900">{booking.name}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-600 mb-1">ইমেইল</p>
                <p className="text-lg text-gray-900">{booking.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-600 mb-1">ফোন</p>
                <p className="text-lg text-gray-900">{booking.phone}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-600 mb-1">বয়স</p>
                <p className="text-lg text-gray-900">{booking.age} বছর</p>
              </div>
              {bookingDate && (
                <div>
                  <p className="text-sm font-bold text-gray-600 mb-1">তারিখ</p>
                  <p className="text-lg text-gray-900">{bookingDate.toLocaleDateString('bn-BD')}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-bold text-gray-600 mb-1">সময়</p>
                <p className="text-lg text-gray-900">{booking.selectedTime}</p>
              </div>
              {localUser?.studentId && (
                <div>
                  <p className="text-sm font-bold text-gray-600 mb-1">স্টুডেন্ট আইডি</p>
                  <p className="text-lg text-tinder font-bold">{localUser.studentId}</p>
                </div>
              )}
              {localUser?.status && (
                <div>
                  <p className="text-sm font-bold text-gray-600 mb-1">স্ট্যাটাস</p>
                  <p className="text-lg text-gray-900">
                    {localUser.status === 'pending' && '⏳ অপেক্ষমাণ'}
                    {localUser.status === 'approved' && '✅ অনুমোদিত'}
                    {localUser.status === 'completed' && '🎓 সম্পন্ন'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Package Selection (for pending bookings) */}
          {booking.status === 'pending' && (
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-300 rounded-xl">
              <h3 className="text-lg font-bold text-gray-900 mb-3">প্যাকেজ নির্বাচন করুন</h3>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setAssignedPackage('15-days')}
                  className={`p-4 rounded-xl border-2 font-bold transition-all ${
                    assignedPackageState === '15-days'
                      ? 'bg-tinder text-white border-tinder'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-tinder'
                  }`}
                >
                  ১৫ দিন
                </button>
                <button
                  onClick={() => setAssignedPackage('1-month')}
                  className={`p-4 rounded-xl border-2 font-bold transition-all ${
                    assignedPackageState === '1-month'
                      ? 'bg-tinder text-white border-tinder'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-tinder'
                  }`}
                >
                  ১ মাস
                </button>
                <button
                  onClick={() => setAssignedPackage('old-student')}
                  className={`p-4 rounded-xl border-2 font-bold transition-all ${
                    assignedPackageState === 'old-student'
                      ? 'bg-tinder text-white border-tinder'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-tinder'
                  }`}
                >
                  পুরাতন শিক্ষার্থী
                </button>
              </div>
            </div>
          )}

          {/* Fee Management */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold text-gray-900">ফি ব্যবস্থাপনা</h3>
              <button
                onClick={() => setShowFeeSection(!showFeeSection)}
                className="text-tinder hover:text-red-600 font-bold"
              >
                {showFeeSection ? 'লুকান' : 'সম্পাদনা'}
              </button>
            </div>
            
            {showFeeSection ? (
              <div className="p-4 bg-gray-50 border-2 border-gray-300 rounded-xl space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">মোট ফি</label>
                    <input
                      type="number"
                      value={fee}
                      onChange={(e) => setFee(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">মোট প্রদত্ত</label>
                    <input
                      type="number"
                      value={totalPaid}
                      onChange={(e) => setTotalPaid(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      min="0"
                      max={fee}
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleUpdateFee}
                    disabled={loading}
                  >
                    আপডেট করুন
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFeeSection(false)}
                  >
                    বাতিল
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-sm font-bold text-gray-600 mb-1">মোট ফি</p>
                  <p className="text-xl font-bold text-gray-900">৳{booking.fee || 0}</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-600 mb-1">মোট প্রদত্ত</p>
                  <p className="text-xl font-bold text-green-600">৳{booking.totalPaid || 0}</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-600 mb-1">বাকি</p>
                  <p className={`text-xl font-bold ${due > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    ৳{due || 0}
                  </p>
                </div>
              </div>
            )}

            {/* Add Payment */}
            {booking.status === 'confirmed' && (
              <div className="mt-4">
                <button
                  onClick={() => setShowPaymentForm(!showPaymentForm)}
                  className="text-sm text-tinder hover:text-red-600 font-bold"
                >
                  {showPaymentForm ? 'লুকান' : '+ নতুন পেমেন্ট যোগ করুন'}
                </button>
                
                {showPaymentForm && (
                  <div className="mt-3 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-xl space-y-3">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">পরিমাণ</label>
                      <input
                        type="number"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">পদ্ধতি</label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value as 'cash' | 'bank' | 'other')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="cash">নগদ</option>
                        <option value="bank">ব্যাংক</option>
                        <option value="other">অন্যান্য</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">নোট (ঐচ্ছিক)</label>
                      <input
                        type="text"
                        value={paymentNotes}
                        onChange={(e) => setPaymentNotes(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="পেমেন্ট সম্পর্কে নোট"
                      />
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleAddPayment}
                      disabled={loading || paymentAmount <= 0}
                    >
                      পেমেন্ট যোগ করুন
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            {booking.status === 'pending' && (
              <>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleConfirm}
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  ✓ নিশ্চিত করুন
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => booking.id && onReject(booking.id)}
                  disabled={loading}
                  className="flex-1 border-red-500 text-red-600 hover:bg-red-50"
                >
                  ✗ প্রত্যাখ্যান করুন
                </Button>
              </>
            )}
            {localUser && localUser.status === 'approved' && onCompleteStudent && (
              <Button
                variant="primary"
                size="lg"
                onClick={() => localUser.studentId && onCompleteStudent(localUser.studentId)}
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                🎓 কোর্স সম্পন্ন করুন
              </Button>
            )}
            {localUser && localUser.status === 'completed' && localUser.certificateLink && (
              <div className="w-full p-4 bg-blue-50 border-2 border-blue-300 rounded-xl">
                <p className="text-sm font-bold text-blue-800 mb-2">🔗 সার্টিফিকেট লিঙ্ক:</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={localUser.certificateLink}
                    readOnly
                    className="flex-1 px-3 py-2 border border-blue-300 rounded-lg text-sm bg-white"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(localUser.certificateLink!);
                      alert('লিঙ্ক কপি করা হয়েছে!');
                    }}
                  >
                    কপি
                  </Button>
                </div>
              </div>
            )}
            {booking.invoiceNumber && booking.fee && (
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  generateInvoice({
                    invoiceNumber: booking.invoiceNumber!,
                    studentId: localUser?.studentId || booking.name,
                    name: booking.name,
                    phone: booking.phone,
                    email: booking.email,
                    address: booking.address,
                    fee: booking.fee,
                    totalPaid: booking.totalPaid || 0,
                    due: booking.due || 0,
                    payments: booking.payments,
                    issueDate: new Date(),
                  });
                }}
                className="w-full border-2 border-green-500 text-green-600 hover:bg-green-50"
              >
                📄 ইনভয়েস ডাউনলোড করুন
              </Button>
            )}
            <Button
              variant="outline"
              size="lg"
              onClick={onClose}
              className="px-6"
            >
              বন্ধ করুন
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
