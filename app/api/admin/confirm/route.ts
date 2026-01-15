import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { adminAuth } from '@/lib/firebaseAdmin';

const ADMIN_UIDS = (process.env.ADMIN_FIREBASE_UIDS || '9Z73mxsFpDZvqdyZ7nNRc6vB7522').split(',').filter(Boolean);

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Verify admin authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const idToken = authHeader.split('Bearer ')[1];
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(idToken);
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (!ADMIN_UIDS.includes(decodedToken.uid)) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { bookingId, action } = body;

    if (!bookingId || !action) {
      return NextResponse.json(
        { success: false, error: 'Booking ID and action are required' },
        { status: 400 }
      );
    }

    if (!['confirm', 'reject'].includes(action)) {
      return NextResponse.json(
        { success: false, error: 'Action must be "confirm" or "reject"' },
        { status: 400 }
      );
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    if (booking.status !== 'pending') {
      return NextResponse.json(
        { success: false, error: `Booking is already ${booking.status}` },
        { status: 400 }
      );
    }

    // Update booking status and admin fields
    booking.status = action === 'confirm' ? 'confirmed' : 'rejected';
    
    if (action === 'confirm') {
      booking.assignedPackage = assignedPackage;
      if (fee !== undefined) {
        booking.fee = fee;
      }
      if (totalPaid !== undefined) {
        booking.totalPaid = totalPaid;
        booking.due = (booking.fee || 0) - totalPaid;
      }
    }
    
    await booking.save();

    return NextResponse.json({
      success: true,
      booking: {
        id: booking._id.toString(),
        status: booking.status,
        packageId: booking.packageId,
        selectedDate: booking.selectedDate.toISOString(),
        selectedTime: booking.selectedTime,
      },
    });
  } catch (error: any) {
    console.error('Admin confirm error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update booking' },
      { status: 500 }
    );
  }
}
