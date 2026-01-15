'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../ui/Button';

const bookingSchema = z.object({
  name: z.string().min(2, 'নাম কমপক্ষে ২ অক্ষর হতে হবে'),
  age: z.number().min(16, 'বয়স কমপক্ষে ১৬ বছর হতে হবে').max(100),
  email: z.string().email('সঠিক ইমেইল ঠিকানা দিন'),
  phone: z.string().min(10, 'ফোন নম্বর কমপক্ষে ১০ সংখ্যা হতে হবে'),
  whyLearning: z.string().min(10, 'কেন শিখতে চান তা জানান'),
  address: z.string().min(5, 'সঠিক ঠিকানা দিন'),
  previousTraining: z.boolean(),
  password: z.string().min(6, 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে').optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  onSubmit: (data: BookingFormData) => void;
  onGoogleAuth: () => void;
  loading?: boolean;
}

export default function BookingForm({ onSubmit, onGoogleAuth, loading = false }: BookingFormProps) {
  const [authMethod, setAuthMethod] = useState<'email' | 'google'>('email');
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      previousTraining: false,
    },
  });

  const previousTraining = watch('previousTraining');

  const handleAutoFillAddress = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Placeholder for address auto-fill
            alert('ঠিকানা স্বয়ংক্রিয়ভাবে পূরণ করার বৈশিষ্ট্যটি শীঘ্রই আসছে');
          } catch (error) {
            console.error('Error getting address:', error);
          }
        },
        () => {
          alert('অনুগ্রহ করে লোকেশন সার্ভিস চালু করুন অথবা নিজে ঠিকানা দিন');
        }
      );
    }
  };

  if (authMethod === 'google') {
    return (
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">Google দিয়ে সাইন ইন করুন</h2>
        <Button
          variant="primary"
          size="lg"
          className="w-full bg-tinder hover:bg-red-600 text-lg py-4"
          onClick={onGoogleAuth}
          disabled={loading}
        >
          Google দিয়ে চালিয়ে যান
        </Button>
        <button
          onClick={() => setAuthMethod('email')}
          className="mt-4 text-tinder hover:text-red-600 text-base font-medium block mx-auto"
        >
          অথবা ইমেইল ব্যবহার করুন
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold mb-3 text-center text-gray-900">
        আপনার তথ্য দিন
      </h2>
      <p className="text-center text-gray-600 mb-8 text-lg">
        আমরা আপনার সাথে শীঘ্রই যোগাযোগ করব
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
            placeholder="আপনার সম্পূর্ণ নাম লিখুন"
          />
          {errors.name && (
            <p className="mt-2 text-base text-red-600 font-medium">{errors.name.message}</p>
          )}
        </div>

        {/* Age */}
        <div>
          <label htmlFor="age" className="block text-base font-bold text-gray-800 mb-2">
            বয়স <span className="text-red-500">*</span>
          </label>
          <input
            id="age"
            type="number"
            {...register('age', { valueAsNumber: true })}
            className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-tinder focus:border-transparent transition-all text-lg"
            placeholder="আপনার বয়স লিখুন"
            min={16}
            max={100}
          />
          {errors.age && (
            <p className="mt-2 text-base text-red-600 font-medium">{errors.age.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-base font-bold text-gray-800 mb-2">
            ইমেইল <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-tinder focus:border-transparent transition-all text-lg"
            placeholder="আপনার ইমেইল ঠিকানা"
          />
          {errors.email && (
            <p className="mt-2 text-base text-red-600 font-medium">{errors.email.message}</p>
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
            placeholder="আপনার ফোন নম্বর"
          />
          {errors.phone && (
            <p className="mt-2 text-base text-red-600 font-medium">{errors.phone.message}</p>
          )}
        </div>

        {/* Address with Auto-fill */}
        <div>
          <label htmlFor="address" className="block text-base font-bold text-gray-800 mb-2">
            ঠিকানা <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-3">
            <input
              id="address"
              type="text"
              {...register('address')}
              className="flex-1 px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-tinder focus:border-transparent transition-all text-lg"
              placeholder="আপনার সম্পূর্ণ ঠিকানা"
            />
            <button
              type="button"
              onClick={handleAutoFillAddress}
              className="px-6 py-4 bg-gray-100 hover:bg-gray-200 rounded-xl text-base font-bold transition-colors whitespace-nowrap"
            >
              📍 স্বয়ংক্রিয়
            </button>
          </div>
          {errors.address && (
            <p className="mt-2 text-base text-red-600 font-medium">{errors.address.message}</p>
          )}
        </div>

        {/* Why Learning */}
        <div>
          <label htmlFor="whyLearning" className="block text-base font-bold text-gray-800 mb-2">
            কেন শিখতে চান? <span className="text-red-500">*</span>
          </label>
          <textarea
            id="whyLearning"
            {...register('whyLearning')}
            rows={4}
            className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-tinder focus:border-transparent transition-all resize-none text-lg"
            placeholder="আমাদের বলুন কেন আপনি ড্রাইভিং শিখতে চান..."
          ></textarea>
          {errors.whyLearning && (
            <p className="mt-2 text-base text-red-600 font-medium">{errors.whyLearning.message}</p>
          )}
        </div>

        {/* Previous Training */}
        <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-xl border-2 border-gray-200">
          <input
            id="previousTraining"
            type="checkbox"
            {...register('previousTraining')}
            className="w-6 h-6 text-tinder border-gray-300 rounded focus:ring-tinder cursor-pointer"
          />
          <label htmlFor="previousTraining" className="text-base font-bold text-gray-800 cursor-pointer flex-1">
            আগে ড্রাইভিং প্রশিক্ষণ নিয়েছেন?
          </label>
        </div>

        {/* Password (Optional) */}
        <div>
          <label htmlFor="password" className="block text-base font-bold text-gray-800 mb-2">
            পাসওয়ার্ড (ঐচ্ছিক - অ্যাকাউন্ট তৈরির জন্য)
          </label>
          <input
            id="password"
            type="password"
            {...register('password')}
            className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-tinder focus:border-transparent transition-all text-lg"
            placeholder="পাসওয়ার্ড তৈরি করুন (ঐচ্ছিক)"
          />
          {errors.password && (
            <p className="mt-2 text-base text-red-600 font-medium">{errors.password.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex flex-col gap-4 pt-6">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full bg-tinder hover:bg-red-600 text-white font-bold py-5 rounded-xl shadow-tinder transform transition-all hover:scale-105 active:scale-95 text-lg"
            disabled={loading}
          >
            {loading ? 'প্রক্রিয়াকরণ হচ্ছে...' : '🚗 সময় স্লট নির্বাচন করুন'}
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">অথবা</span>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full border-3 border-tinder text-tinder hover:bg-pink-50 font-bold py-5 rounded-xl text-lg"
            onClick={onGoogleAuth}
            disabled={loading}
          >
            Google দিয়ে চালিয়ে যান
          </Button>
        </div>
      </form>
    </div>
  );
}
