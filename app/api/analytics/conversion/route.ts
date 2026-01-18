import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;

/**
 * Server-side Meta Conversion API endpoint
 * Tracks purchase/conversion events when bookings are confirmed
 */
export async function POST(request: NextRequest) {
  try {
    // Check if Meta Pixel and access token are configured
    if (!META_PIXEL_ID || !META_ACCESS_TOKEN) {
      console.warn('[Meta Conversion API] Meta Pixel ID or Access Token not configured. Event not sent.');
      return NextResponse.json({
        success: false,
        error: 'Meta Pixel not configured',
      });
    }

    const body = await request.json();
    const {
      eventName = 'Purchase',
      bookingId,
      packageId,
      email,
      phone,
      value,
      currency = 'BDT',
    } = body;

    // Validate required fields
    if (!bookingId || !packageId) {
      return NextResponse.json(
        { success: false, error: 'Booking ID and Package ID are required' },
        { status: 400 }
      );
    }

    // Hash email and phone for privacy (SHA-256 as required by Meta)
    const hashValue = (value: string): string => {
      return crypto.createHash('sha256').update(value.toLowerCase().trim()).digest('hex');
    };

    // Prepare user data
    const userData: any = {
      client_ip_address: request.headers.get('x-forwarded-for') || 
                         request.headers.get('x-real-ip') || 
                         'unknown',
      client_user_agent: request.headers.get('user-agent') || 'unknown',
    };

    if (email) {
      userData.em = [hashValue(email)]; // Email (hashed)
    }
    if (phone) {
      userData.ph = [hashValue(phone.replace(/\D/g, ''))]; // Phone (hashed, digits only)
    }

    // Prepare event data
    const eventData = {
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      action_source: 'website',
      event_source_url: request.headers.get('referer') || 'unknown',
      user_data: userData,
      custom_data: {
        content_ids: [packageId],
        content_type: 'product',
        value: value || 0,
        currency: currency,
      },
    };

    // Send to Meta Conversions API
    const response = await fetch(
      `https://graph.facebook.com/v21.0/${META_PIXEL_ID}/events`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: [eventData],
          access_token: META_ACCESS_TOKEN,
        }),
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      console.error('[Meta Conversion API] Error:', responseData);
      return NextResponse.json(
        { success: false, error: responseData.error?.message || 'Failed to send conversion event' },
        { status: response.status }
      );
    }

    console.log('[Meta Conversion API] Conversion event sent successfully:', {
      bookingId,
      eventName,
    });

    return NextResponse.json({
      success: true,
      eventId: responseData.events_received?.[0]?.event_id,
    });
  } catch (error: any) {
    console.error('[Meta Conversion API] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to send conversion event' },
      { status: 500 }
    );
  }
}