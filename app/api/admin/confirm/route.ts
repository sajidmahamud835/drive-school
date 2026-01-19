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
    const { bookingId, action, assignedPackage, fee, totalPaid } = body;

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
      if (assignedPackage) {
        booking.assignedPackage = assignedPackage;
      }
      if (fee !== undefined) {
        booking.fee = fee;
      }
      if (totalPaid !== undefined) {
        booking.totalPaid = totalPaid;
        booking.due = (booking.fee || 0) - totalPaid;
      }

      // Track conversion via unified tracking API (server-side)
      // Tracks to: GA4, Meta Pixel, TikTok Pixel, Google Ads
      // Uses hidden price for measurement tools based on package ID
      // Includes email/phone for Enhanced Conversions
      try {
        // Get hidden price for package (not visible on website)
        const packageHiddenPrices: Record<string, number> = {
          '15-days': 5500,
          '1-month': 8000,
          'pay-as-you-go': 0,
        };
        const hiddenPrice = packageHiddenPrices[booking.packageId] || booking.fee || 0;
        
        const url = new URL(request.url);
        const baseUrl = `${url.protocol}//${url.host}`;
        
        await fetch(`${baseUrl}/api/analytics/track`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            eventName: 'purchase',
            eventParams: {
              transaction_id: booking._id.toString(),
              package_id: booking.packageId, // Unique package ID
              value: hiddenPrice, // Hidden price for measurement tools
              currency: 'BDT',
            },
            ga4Params: {
              transaction_id: booking._id.toString(),
              package_id: booking.packageId, // Unique package ID
              value: hiddenPrice, // Hidden price
              currency: 'BDT',
            },
            metaParams: {
              email: booking.email, // User email for Enhanced Conversions
              phone: booking.phone, // User phone for Enhanced Conversions
              content_ids: [booking.packageId], // Unique package ID
              content_type: 'product',
              value: hiddenPrice, // Hidden price
              currency: 'BDT',
            },
            tiktokParams: {
              email: booking.email, // User email for Enhanced Conversions
              phone: booking.phone, // User phone for Enhanced Conversions
              content_ids: [booking.packageId], // Unique package ID
              package_id: booking.packageId, // Unique package ID
              value: hiddenPrice, // Hidden price
              currency: 'BDT',
            },
            googleAdsParams: {
              email: booking.email, // User email for Enhanced Conversions
              phone: booking.phone, // User phone for Enhanced Conversions
              value: hiddenPrice, // Hidden price
              currency: 'BDT',
            },
          }),
        }).catch((error) => {
          // Log but don't throw - conversion tracking failure shouldn't break booking confirmation
          console.error('[Admin Confirm] Failed to track conversion:', error);
        });
      } catch (error) {
        console.error('[Admin Confirm] Error sending conversion event:', error);
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
