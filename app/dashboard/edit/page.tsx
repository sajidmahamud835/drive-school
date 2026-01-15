'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User } from '@/types';
import Button from '@/components/ui/Button';
import Link from 'next/link';

const profileSchema = z.object({
  name: z.string().min(2, 'নাম কমপক্ষে ২ অক্ষর হতে হবে'),
  age: z.number().min(16, 'বয়স কমপক্ষে ১৬ বছর হতে হবে').max(100).optional(),
  phone: z.string().min(10, 'ফোন নম্বর কমপক্ষে ১০ সংখ্যা হতে হবে'),
  address: z.string().optional(),
  dateOfBirth: z.string().optional(),
  nid: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  bloodGroup: z.string().optional(),
  occupation: z.string().optional(),
  education: z.string().optional(),
  // Social media profiles
  facebook: z.string().url('সঠিক URL দিন').optional().or(z.literal('')),
  instagram: z.string().url('সঠিক URL দিন').optional().or(z.literal('')),
  twitter: z.string().url('সঠিক URL দিন').optional().or(z.literal('')),
  linkedin: z.string().url('সঠিক URL দিন').optional().or(z.literal('')),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function EditProfilePage() {
  const router = useRouter();
  const { user: firebaseUser, getIdToken, loading: authLoading } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

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
      // Reset form with user data
      reset({
        name: data.user.name,
        age: data.user.age,
        phone: data.user.phone,
        address: data.user.address || '',
        dateOfBirth: data.user.dateOfBirth
          ? new Date(data.user.dateOfBirth).toISOString().split('T')[0]
          : '',
        nid: data.user.nid || '',
        emergencyContact: data.user.emergencyContact || '',
        emergencyPhone: data.user.emergencyPhone || '',
        bloodGroup: data.user.bloodGroup || '',
        occupation: data.user.occupation || '',
        education: data.user.education || '',
        facebook: data.user.facebook || '',
        instagram: data.user.instagram || '',
        twitter: data.user.twitter || '',
        linkedin: data.user.linkedin || '',
      });
    } catch (error: any) {
      console.error('Profile fetch error:', error);
      setError(error.message || 'প্রোফাইল লোড করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    if (!firebaseUser) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      const idToken = await getIdToken();
      if (!idToken) {
        throw new Error('Authentication token not available');
      }

      const response = await fetch('/api/student/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'প্রোফাইল আপডেট করতে সমস্যা হয়েছে');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (error: any) {
      console.error('Profile update error:', error);
      setError(error.message || 'প্রোফাইল আপডেট করতে সমস্যা হয়েছে');
    } finally {
      setSaving(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              <span className="text-tinder">প্রোফাইল</span> সম্পাদনা করুন
            </h1>
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                ← ফিরে যান
              </Button>
            </Link>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 rounded-xl">
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border-2 border-green-300 rounded-xl">
              <p className="text-green-800 font-medium">✅ প্রোফাইল সফলভাবে আপডেট হয়েছে!</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-base font-bold text-gray-800 mb-2">
                  নাম <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  {...register('name')}
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-tinder focus:border-transparent transition-all text-lg"
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              {/* Age */}
              <div>
                <label htmlFor="age" className="block text-base font-bold text-gray-800 mb-2">
                  বয়স
                </label>
                <input
                  id="age"
                  type="number"
                  {...register('age', { valueAsNumber: true })}
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-tinder focus:border-transparent transition-all text-lg"
                  min={16}
                  max={100}
                />
                {errors.age && (
                  <p className="mt-2 text-sm text-red-600">{errors.age.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-base font-bold text-gray-800 mb-2">
                  ফোন <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  {...register('phone')}
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-tinder focus:border-transparent transition-all text-lg"
                />
                {errors.phone && (
                  <p className="mt-2 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              {/* Date of Birth */}
              <div>
                <label htmlFor="dateOfBirth" className="block text-base font-bold text-gray-800 mb-2">
                  জন্ম তারিখ
                </label>
                <input
                  id="dateOfBirth"
                  type="date"
                  {...register('dateOfBirth')}
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-tinder focus:border-transparent transition-all text-lg"
                />
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-base font-bold text-gray-800 mb-2">
                  ঠিকানা
                </label>
                <textarea
                  id="address"
                  {...register('address')}
                  rows={3}
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-tinder focus:border-transparent transition-all text-lg"
                />
              </div>

              {/* NID */}
              <div>
                <label htmlFor="nid" className="block text-base font-bold text-gray-800 mb-2">
                  জাতীয় পরিচয়পত্র
                </label>
                <input
                  id="nid"
                  type="text"
                  {...register('nid')}
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-tinder focus:border-transparent transition-all text-lg"
                />
              </div>

              {/* Blood Group */}
              <div>
                <label htmlFor="bloodGroup" className="block text-base font-bold text-gray-800 mb-2">
                  রক্তের গ্রুপ
                </label>
                <select
                  id="bloodGroup"
                  {...register('bloodGroup')}
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-tinder focus:border-transparent transition-all text-lg bg-white"
                >
                  <option value="">নির্বাচন করুন</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              {/* Occupation */}
              <div>
                <label htmlFor="occupation" className="block text-base font-bold text-gray-800 mb-2">
                  পেশা
                </label>
                <input
                  id="occupation"
                  type="text"
                  {...register('occupation')}
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-tinder focus:border-transparent transition-all text-lg"
                />
              </div>

              {/* Education */}
              <div>
                <label htmlFor="education" className="block text-base font-bold text-gray-800 mb-2">
                  শিক্ষাগত যোগ্যতা
                </label>
                <input
                  id="education"
                  type="text"
                  {...register('education')}
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-tinder focus:border-transparent transition-all text-lg"
                />
              </div>

              {/* Emergency Contact */}
              <div>
                <label htmlFor="emergencyContact" className="block text-base font-bold text-gray-800 mb-2">
                  জরুরি যোগাযোগ (নাম)
                </label>
                <input
                  id="emergencyContact"
                  type="text"
                  {...register('emergencyContact')}
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-tinder focus:border-transparent transition-all text-lg"
                />
              </div>

              {/* Emergency Phone */}
              <div>
                <label htmlFor="emergencyPhone" className="block text-base font-bold text-gray-800 mb-2">
                  জরুরি যোগাযোগ (ফোন)
                </label>
                <input
                  id="emergencyPhone"
                  type="tel"
                  {...register('emergencyPhone')}
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-tinder focus:border-transparent transition-all text-lg"
                />
              </div>

              {/* Social Media Profiles */}
              <div className="md:col-span-2">
                <h3 className="text-xl font-bold text-gray-900 mb-4 mt-6">সোশ্যাল মিডিয়া প্রোফাইল</h3>
              </div>

              {/* Facebook */}
              <div>
                <label htmlFor="facebook" className="block text-base font-bold text-gray-800 mb-2">
                  Facebook
                </label>
                <input
                  id="facebook"
                  type="url"
                  {...register('facebook')}
                  placeholder="https://facebook.com/yourprofile"
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-tinder focus:border-transparent transition-all text-lg"
                />
                {errors.facebook && (
                  <p className="mt-2 text-sm text-red-600">{errors.facebook.message}</p>
                )}
              </div>

              {/* Instagram */}
              <div>
                <label htmlFor="instagram" className="block text-base font-bold text-gray-800 mb-2">
                  Instagram
                </label>
                <input
                  id="instagram"
                  type="url"
                  {...register('instagram')}
                  placeholder="https://instagram.com/yourprofile"
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-tinder focus:border-transparent transition-all text-lg"
                />
                {errors.instagram && (
                  <p className="mt-2 text-sm text-red-600">{errors.instagram.message}</p>
                )}
              </div>

              {/* Twitter */}
              <div>
                <label htmlFor="twitter" className="block text-base font-bold text-gray-800 mb-2">
                  Twitter
                </label>
                <input
                  id="twitter"
                  type="url"
                  {...register('twitter')}
                  placeholder="https://twitter.com/yourprofile"
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-tinder focus:border-transparent transition-all text-lg"
                />
                {errors.twitter && (
                  <p className="mt-2 text-sm text-red-600">{errors.twitter.message}</p>
                )}
              </div>

              {/* LinkedIn */}
              <div>
                <label htmlFor="linkedin" className="block text-base font-bold text-gray-800 mb-2">
                  LinkedIn
                </label>
                <input
                  id="linkedin"
                  type="url"
                  {...register('linkedin')}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-tinder focus:border-transparent transition-all text-lg"
                />
                {errors.linkedin && (
                  <p className="mt-2 text-sm text-red-600">{errors.linkedin.message}</p>
                )}
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="flex-1 bg-tinder hover:bg-red-600 text-white font-bold py-4 rounded-xl shadow-tinder"
                disabled={saving}
              >
                {saving ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}
              </Button>
              <Link href="/dashboard">
                <Button type="button" variant="outline" size="lg" className="px-8">
                  বাতিল
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
