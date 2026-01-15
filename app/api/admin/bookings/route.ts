import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { adminAuth } from '@/lib/firebaseAdmin';

const ADMIN_UIDS = (process.env.ADMIN_FIREBASE_UIDS || '9Z73mxsFpDZvqdyZ7nNRc6vB7522').split(',').filter(Boolean);

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    // Build query
    const query: any = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    // Fetch bookings
    const bookings = await Booking.find(query)
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return NextResponse.json({
      success: true,
      bookings: bookings.map((booking) => ({
        id: booking._id.toString(),
        userFirebaseUid: booking.userFirebaseUid,
        packageId: booking.packageId,
        selectedDate: booking.selectedDate.toISOString(),
        selectedTime: booking.selectedTime,
        status: booking.status,
        phone: booking.phone,
        email: booking.email,
        name: booking.name,
        age: booking.age,
        whyLearning: booking.whyLearning,
        address: booking.address,
        previousTraining: booking.previousTraining,
        assignedPackage: booking.assignedPackage,
        fee: booking.fee,
        totalPaid: booking.totalPaid,
        due: booking.due,
        payments: booking.payments,
        invoiceNumber: booking.invoiceNumber,
        createdAt: booking.createdAt.toISOString(),
        updatedAt: booking.updatedAt.toISOString(),
      })),
    });
  } catch (error: any) {
    console.error('Admin bookings fetch error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
