'use client';

import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import { format } from 'date-fns';
import { Booking } from '@/types';

interface BookingListProps {
  bookings: Booking[];
  onConfirm: (bookingId: string) => void;
  onReject: (bookingId: string) => void;
  loading?: boolean;
}

export default function BookingList({ bookings, onConfirm, onReject, loading = false }: BookingListProps) {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No pending bookings</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => {
        const bookingDate = booking.selectedDate ? new Date(booking.selectedDate) : null;
        return (
          <Card key={booking.id}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-lg font-semibold">Booking #{booking.id?.slice(-8)}</h3>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        booking.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : booking.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <p>{booking.email || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Phone</p>
                      <p>{booking.phone}</p>
                    </div>
                    {bookingDate && (
                      <div>
                        <p className="font-medium text-gray-900">Date</p>
                        <p>{format(bookingDate, 'MMM d, yyyy')}</p>
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">Time</p>
                      <p>{booking.selectedTime}</p>
                    </div>
                  </div>
                </div>
                {booking.status === 'pending' && (
                  <div className="flex gap-3">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => booking.id && onConfirm(booking.id)}
                      disabled={loading}
                    >
                      Confirm
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => booking.id && onReject(booking.id)}
                      disabled={loading}
                    >
                      Reject
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
