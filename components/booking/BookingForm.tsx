'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../ui/Button';

const bookingSchema = z.object({
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
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
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  if (authMethod === 'google') {
    return (
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-6">Sign in with Google</h2>
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={onGoogleAuth}
          disabled={loading}
        >
          Continue with Google
        </Button>
        <button
          onClick={() => setAuthMethod('email')}
          className="mt-4 text-blue-600 hover:text-blue-700 text-sm"
        >
          Or use email instead
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Create Account</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="your@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            {...register('phone')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+1 234 567 8900"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register('password')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Create a password"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account & Continue'}
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or</span>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full"
            onClick={onGoogleAuth}
            disabled={loading}
          >
            Continue with Google
          </Button>
        </div>
      </form>
    </div>
  );
}
