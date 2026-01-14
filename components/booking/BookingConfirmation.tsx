'use client';

import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import { format } from 'date-fns';
import Link from 'next/link';
import { Booking, Package } from '@/types';

interface BookingConfirmationProps {
  booking: Booking;
  packageInfo: Package | null;
}

export default function BookingConfirmation({ booking, packageInfo }: BookingConfirmationProps) {
  const bookingDate = booking.selectedDate ? new Date(booking.selectedDate) : null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600">
          Your booking has been submitted and is pending confirmation
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Booking Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Package</p>
            <p className="font-semibold">{packageInfo?.name || 'N/A'}</p>
          </div>
          {bookingDate && (
            <div>
              <p className="text-sm text-gray-600">Date</p>
              <p className="font-semibold">{format(bookingDate, 'EEEE, MMMM d, yyyy')}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-600">Time</p>
            <p className="font-semibold">{booking.selectedTime}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
              Pending Confirmation
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h3 className="font-semibold mb-2">What's Next?</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>✓ You will receive a confirmation email shortly</li>
          <li>✓ Our team will review your booking</li>
          <li>✓ You'll receive the meetup address once confirmed</li>
          <li>✓ Please arrive on time for your lesson</li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/">
          <Button variant="outline" size="lg">
            Back to Home
          </Button>
        </Link>
        <Button variant="primary" size="lg">
          View My Bookings
        </Button>
      </div>
    </div>
  );
}
