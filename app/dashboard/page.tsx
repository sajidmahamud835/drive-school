'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { generateStudentIDCard, generateCompletionCertificate } from '@/lib/pdfUtils';
import { isProfileCompleteForIDCard, getProfileCompletionPercentage, getMissingFieldsForIDCard } from '@/lib/profileCompletion';
import { User } from '@/types';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const { user: firebaseUser, getIdToken, logout, loading: authLoading } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!authLoading && !firebaseUser) {
      router.push('/login');
      return;
    }

    if (firebaseUser) {
      fetchProfile();
    }
  }, [firebaseUser, authLoading, router]);

  const fetchProfile = async () => {
    if (!firebaseUser) return;

    try {
      setLoading(true);
      const idToken = await getIdToken();
      if (!idToken) {
        throw new Error('Authentication token not available');
      }

      const response = await fetch('/api/student/profile', {
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'প্রোফাইল লোড করতে সমস্যা হয়েছে');
      }

      setUser(data.user);
    } catch (error: any) {
      console.error('Profile fetch error:', error);
      setError(error.message || 'প্রোফাইল লোড করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadIDCard = () => {
    if (!user || !user.studentId) {
      alert('স্টুডেন্ট আইডি পাওয়া যায়নি');
      return;
    }

    // Check if profile is complete
    if (!isProfileCompleteForIDCard(user)) {
      const missingFields = getMissingFieldsForIDCard(user);
      alert(`আইডি কার্ড ডাউনলোড করতে আপনার প্রোফাইল ১০০% সম্পূর্ণ করতে হবে।\n\nঅপূর্ণ তথ্য:\n${missingFields.join('\n')}\n\nঅনুগ্রহ করে প্রোফাইল সম্পাদনা করুন।`);
      return;
    }

    generateStudentIDCard({
      studentId: user.studentId,
      name: user.name,
      age: user.age,
      gender: user.gender,
      phone: user.phone,
      email: user.email,
      address: user.address,
    });
  };

  const handleDownloadCertificate = () => {
    if (!user || !user.studentId) {
      alert('স্টুডেন্ট আইডি পাওয়া যায়নি');
      return;
    }

    // Check if course is completed
    if (user.status !== 'completed') {
      alert('সার্টিফিকেট ডাউনলোড করতে আপনাকে কোর্স সম্পন্ন করতে হবে।');
      return;
    }

    // Use completion date from database or current date
    const completionDate = user.completionDate ? new Date(user.completionDate) : new Date();

    generateCompletionCertificate({
      studentId: user.studentId,
      name: user.name,
      completionDate,
      packageName: 'ড্রাইভিং প্রশিক্ষণ কোর্স',
      certificateId: user.certificateId,
    });
  };

  const profileComplete = isProfileCompleteForIDCard(user);
  const profileCompletionPercentage = getProfileCompletionPercentage(user);
  const missingFields = getMissingFieldsForIDCard(user);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-red-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tinder mx-auto"></div>
          <p className="mt-4 text-gray-600">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-red-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'প্রোফাইল লোড করতে সমস্যা হয়েছে'}</p>
          <Button onClick={fetchProfile} variant="primary">
            আবার চেষ্টা করুন
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                <span className="text-tinder">আমার</span> প্রোফাইল
              </h1>
              {user.studentId && (
                <p className="text-lg text-gray-600">
                  স্টুডেন্ট আইডি: <span className="font-bold text-tinder">{user.studentId}</span>
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <Link href="/">
                <Button variant="outline" size="sm">
                  হোম
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                লগআউট
              </Button>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">অবস্থা</p>
              <p className="text-2xl font-bold">
                {user.status === 'pending' && <span className="text-yellow-600">⏳ অপেক্ষমাণ</span>}
                {user.status === 'approved' && <span className="text-green-600">✅ অনুমোদিত</span>}
                {user.status === 'completed' && <span className="text-blue-600">🎓 সম্পন্ন</span>}
              </p>
            </div>
            {user.status === 'approved' && (
              <div className="flex flex-col gap-3">
                {profileComplete ? (
                  <Button variant="primary" onClick={handleDownloadIDCard}>
                    📄 স্টুডেন্ট আইডি কার্ড ডাউনলোড
                  </Button>
                ) : (
                  <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4">
                    <p className="text-yellow-800 font-bold mb-2">⚠️ প্রোফাইল সম্পূর্ণ করুন</p>
                    <p className="text-sm text-yellow-700 mb-3">
                      আইডি কার্ড ডাউনলোড করতে প্রোফাইল {profileCompletionPercentage}% সম্পূর্ণ। প্রয়োজন: ১০০%
                    </p>
                    <p className="text-xs text-yellow-600 mb-3">
                      অপূর্ণ তথ্য: {missingFields.join(', ')}
                    </p>
                    <Link href="/dashboard/edit">
                      <Button variant="primary" size="sm" className="w-full">
                        প্রোফাইল সম্পাদনা করুন
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
            {user.status === 'completed' && (
              <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                  {profileComplete ? (
                    <Button variant="primary" onClick={handleDownloadIDCard}>
                      📄 আইডি কার্ড
                    </Button>
                  ) : (
                    <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-3 flex-1">
                      <p className="text-xs text-yellow-700">
                        আইডি কার্ডের জন্য প্রোফাইল সম্পূর্ণ করুন ({profileCompletionPercentage}%)
                      </p>
                    </div>
                  )}
                  <Button variant="primary" onClick={handleDownloadCertificate}>
                    🎓 সার্টিফিকেট
                  </Button>
                </div>
                {user.certificateLink && (
                  <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-3">
                    <p className="text-sm text-blue-800 font-bold mb-1">🔗 সার্টিফিকেট লিঙ্ক:</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={user.certificateLink}
                        readOnly
                        className="flex-1 px-3 py-2 border border-blue-300 rounded-lg text-sm bg-white"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(user.certificateLink!);
                          alert('লিঙ্ক কপি করা হয়েছে!');
                        }}
                      >
                        কপি
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">ব্যক্তিগত তথ্য</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">নাম</label>
              <p className="text-lg text-gray-900">{user.name}</p>
            </div>
            
            {user.age && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">বয়স</label>
                <p className="text-lg text-gray-900">{user.age} বছর</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">লিঙ্গ</label>
              <p className="text-lg text-gray-900">
                {user.gender === 'male' ? 'পুরুষ' : user.gender === 'female' ? 'মহিলা' : 'অন্যান্য'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">ইমেইল</label>
              <p className="text-lg text-gray-900">{user.email}</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">ফোন</label>
              <p className="text-lg text-gray-900">{user.phone}</p>
            </div>

            {user.address && (
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-1">ঠিকানা</label>
                <p className="text-lg text-gray-900">{user.address}</p>
              </div>
            )}

            {user.nid && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">জাতীয় পরিচয়পত্র</label>
                <p className="text-lg text-gray-900">{user.nid}</p>
              </div>
            )}

            {user.bloodGroup && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">রক্তের গ্রুপ</label>
                <p className="text-lg text-gray-900">{user.bloodGroup}</p>
              </div>
            )}

            {user.occupation && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">পেশা</label>
                <p className="text-lg text-gray-900">{user.occupation}</p>
              </div>
            )}

            {user.education && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">শিক্ষাগত যোগ্যতা</label>
                <p className="text-lg text-gray-900">{user.education}</p>
              </div>
            )}

            {user.emergencyContact && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">জরুরি যোগাযোগ</label>
                <p className="text-lg text-gray-900">{user.emergencyContact}</p>
                {user.emergencyPhone && (
                  <p className="text-sm text-gray-600">{user.emergencyPhone}</p>
                )}
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link href="/dashboard/edit">
              <Button variant="primary" className="w-full md:w-auto">
                প্রোফাইল সম্পাদনা করুন
              </Button>
            </Link>
          </div>
        </div>

        {/* Review Section - Only for completed students */}
        {user.status === 'completed' && (
          <ReviewForm user={user} />
        )}
      </div>
    </div>
  );
}

// Review Form Component
function ReviewForm({ user }: { user: User }) {
  const { getIdToken } = useAuth();
  const [rating, setRating] = useState<number>(5);
  const [text, setText] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existingReview, setExistingReview] = useState<any>(null);
  const [checkingReview, setCheckingReview] = useState(true);

  useEffect(() => {
    checkExistingReview();
  }, []);

  const checkExistingReview = async () => {
    try {
      const idToken = await getIdToken();
      if (!idToken) return;

      const response = await fetch('/api/reviews/check', {
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      });

      const data = await response.json();
      if (data.success && data.hasReview) {
        setExistingReview(data.review);
        if (data.review.status === 'approved') {
          setSubmitted(true); // Show success message if already approved
        } else if (data.review.status === 'pending') {
          // Pre-fill form with existing review
          setRating(data.review.rating);
          setText(data.review.text);
        }
      }
    } catch (error) {
      console.error('Error checking review:', error);
    } finally {
      setCheckingReview(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim() || text.trim().length < 10) {
      setError('রিভিউ কমপক্ষে ১০ অক্ষর হতে হবে');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const idToken = await getIdToken();
      if (!idToken) {
        throw new Error('Authentication token not available');
      }

      const response = await fetch('/api/reviews/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          rating,
          text: text.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'রিভিউ জমা দিতে সমস্যা হয়েছে');
      }

      setSubmitted(true);
      setText('');
      setRating(5);
      // Refresh existing review check
      await checkExistingReview();
    } catch (error: any) {
      console.error('Review submission error:', error);
      setError(error.message || 'রিভিউ জমা দিতে সমস্যা হয়েছে');
    } finally {
      setSubmitting(false);
    }
  };

  if (checkingReview) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tinder mx-auto"></div>
          <p className="mt-4 text-gray-600">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (submitted || (existingReview && existingReview.status === 'approved')) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">ধন্যবাদ!</h3>
          {existingReview && existingReview.status === 'approved' ? (
            <>
              <p className="text-gray-700 mb-4">আপনার রিভিউ ইতিমধ্যে প্রকাশিত হয়েছে।</p>
              <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4 mt-4">
                <div className="flex text-yellow-400 justify-center mb-2">
                  {[...Array(existingReview.rating)].map((_, i) => (
                    <svg key={i} className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-800 italic">"{existingReview.text}"</p>
              </div>
            </>
          ) : (
            <>
              <p className="text-gray-700 mb-4">আপনার রিভিউ সফলভাবে জমা দেওয়া হয়েছে।</p>
              <p className="text-sm text-gray-600">অ্যাডমিন অনুমোদনের পর এটি প্রকাশিত হবে।</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSubmitted(false);
                  setExistingReview(null);
                }}
                className="mt-6"
              >
                রিভিউ সম্পাদনা করুন
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">রিভিউ দিন</h2>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 rounded-xl">
          <p className="text-red-800 font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-base font-bold text-gray-800 mb-3">
            রেটিং <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`w-12 h-12 rounded-lg transition-all transform hover:scale-110 ${
                  star <= rating
                    ? 'bg-yellow-400 text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {rating === 5 && 'চমৎকার! ⭐⭐⭐⭐⭐'}
            {rating === 4 && 'ভালো ⭐⭐⭐⭐'}
            {rating === 3 && 'মাঝারি ⭐⭐⭐'}
            {rating === 2 && 'খারাপ ⭐⭐'}
            {rating === 1 && 'খুব খারাপ ⭐'}
          </p>
        </div>

        {/* Review Text */}
        <div>
          <label htmlFor="review-text" className="block text-base font-bold text-gray-800 mb-2">
            আপনার মতামত <span className="text-red-500">*</span>
          </label>
          <textarea
            id="review-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-tinder focus:border-transparent transition-all text-lg"
            placeholder="আপনার অভিজ্ঞতা শেয়ার করুন... (কমপক্ষে ১০ অক্ষর)"
            required
            minLength={10}
          />
          <p className="text-sm text-gray-600 mt-2">
            {text.length}/১০+ অক্ষর
          </p>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full bg-tinder hover:bg-red-600 text-white font-bold py-4 rounded-xl shadow-tinder"
          disabled={submitting || text.trim().length < 10}
        >
          {submitting ? 'জমা দেওয়া হচ্ছে...' : 'রিভিউ জমা দিন'}
        </Button>
      </form>
    </div>
  );
}
