import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { isValidBookingDate, getAvailableTimeSlots } from '@/lib/timeSlotUtils';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');

    if (!dateParam) {
      return NextResponse.json(
        { success: false, error: 'Date parameter is required' },
        { status: 400 }
      );
    }

    const selectedDate = new Date(dateParam);
    
    // Validate date (not Friday)
    if (!isValidBookingDate(selectedDate)) {
      return NextResponse.json({
        success: true,
        available: false,
        message: 'Bookings are not available on Fridays',
        slots: [],
      });
    }

    // Get all available time slots
    const allSlots = getAvailableTimeSlots(selectedDate);

    // Create date range for query (without mutating original date)
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Get booked slots for this date
    const bookedBookings = await Booking.find({
      selectedDate: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
      status: { $in: ['pending', 'confirmed'] },
    });

    const bookedTimes = bookedBookings.map((b) => b.selectedTime);

    // Filter out booked slots
    const availableSlots = allSlots.filter((slot) => !bookedTimes.includes(slot));

    return NextResponse.json({
      success: true,
      date: dateParam,
      available: availableSlots.length > 0,
      slots: availableSlots.map((time) => ({
        time,
        available: true,
      })),
      bookedSlots: bookedTimes,
    });
  } catch (error: any) {
    console.error('Slots fetch error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch slots' },
      { status: 500 }
    );
  }
}
