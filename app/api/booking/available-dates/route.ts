import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { isValidBookingDate, getAvailableTimeSlots } from '@/lib/timeSlotUtils';
import { addDays, isBefore, startOfDay, endOfDay, format, isSameDay } from 'date-fns';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');
    
    // Default to next 60 days
    const startDate = startDateParam ? new Date(startDateParam) : new Date();
    const endDate = endDateParam ? new Date(endDateParam) : addDays(startDate, 60);

    const availableDates: string[] = [];
    const unavailableDates: string[] = [];
    
    // Get all bookings in the date range
    const startOfRange = startOfDay(startDate);
    const endOfRange = endOfDay(endDate);
    
    const bookings = await Booking.find({
      selectedDate: {
        $gte: startOfRange,
        $lte: endOfRange,
      },
      status: { $in: ['pending', 'confirmed'] },
    });

    // Group bookings by date
    const bookingsByDate = new Map<string, number>();
    bookings.forEach((booking) => {
      const dateKey = format(new Date(booking.selectedDate), 'yyyy-MM-dd');
      bookingsByDate.set(dateKey, (bookingsByDate.get(dateKey) || 0) + 1);
    });

    // Check each date in range
    let currentDate = new Date(startDate);
    while (isBefore(currentDate, endDate) || isSameDay(currentDate, endDate)) {
      const dateKey = format(currentDate, 'yyyy-MM-dd');
      
      // Check if date is valid (not Friday)
      if (isValidBookingDate(currentDate)) {
        // Get all available slots for this date
        const allSlots = getAvailableTimeSlots(currentDate);
        const bookedCount = bookingsByDate.get(dateKey) || 0;
        
        // Date is available if there are slots left
        if (bookedCount < allSlots.length) {
          availableDates.push(dateKey);
        } else {
          unavailableDates.push(dateKey);
        }
      } else {
        // Friday - not available
        unavailableDates.push(dateKey);
      }
      
      currentDate = addDays(currentDate, 1);
    }

    return NextResponse.json({
      success: true,
      availableDates,
      unavailableDates,
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
    });
  } catch (error: any) {
    console.error('Available dates fetch error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch available dates' },
      { status: 500 }
    );
  }
}
