import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { adminAuth } from '@/lib/firebaseAdmin';

const ADMIN_UIDS = (process.env.ADMIN_FIREBASE_UIDS || '9Z73mxsFpDZvqdyZ7nNRc6vB7522').split(',').filter(Boolean);

export async function PUT(request: NextRequest) {
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
    const { bookingId, fee, totalPaid, payment } = body;

    if (!bookingId) {
      return NextResponse.json(
        { success: false, error: 'Booking ID is required' },
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

    // Update fee fields
    if (fee !== undefined) {
      booking.fee = fee;
    }
    if (totalPaid !== undefined) {
      booking.totalPaid = totalPaid;
      booking.due = (booking.fee || 0) - totalPaid;
    }

    // Add payment if provided
    if (payment && payment.amount > 0) {
      if (!booking.payments) {
        booking.payments = [];
      }
      booking.payments.push({
        amount: payment.amount,
        date: payment.date ? new Date(payment.date) : new Date(),
        method: payment.method || 'cash',
        notes: payment.notes,
      });
      // Update total paid
      booking.totalPaid = (booking.totalPaid || 0) + payment.amount;
      booking.due = (booking.fee || 0) - booking.totalPaid;
    }

    // Generate invoice number if fee is set and invoice doesn't exist
    if (booking.fee && !booking.invoiceNumber) {
      const year = new Date().getFullYear();
      const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
      booking.invoiceNumber = `INV-${year}-${randomStr}`;
    }

    await booking.save();

    return NextResponse.json({
      success: true,
      booking: {
        id: booking._id.toString(),
        fee: booking.fee,
        totalPaid: booking.totalPaid,
        due: booking.due,
        payments: booking.payments,
        invoiceNumber: booking.invoiceNumber,
      },
    });
  } catch (error: any) {
    console.error('Admin update booking error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update booking' },
      { status: 500 }
    );
  }
}
