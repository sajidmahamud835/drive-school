import { NextRequest, NextResponse } from 'next/server';

const GA4_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;
const GA4_API_SECRET = process.env.GA4_API_SECRET;

/**
 * Server-side tracking endpoint for GA4 and Meta Pixel
 * This sends events from the same domain (Vercel), avoiding third-party blocking
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      eventName,
      eventParams = {},
      ga4Params = {},
      metaParams = {},
    } = body;

    if (!eventName) {
      return NextResponse.json(
        { success: false, error: 'Event name is required' },
        { status: 400 }
      );
    }

    const results: any = {
      success: true,
      ga4: { sent: false },
      meta: { sent: false },
    };

    // Track in GA4 via Measurement Protocol (server-side)
    if (GA4_MEASUREMENT_ID && GA4_API_SECRET) {
      try {
        const clientId = request.headers.get('x-client-id') || 
                        eventParams.client_id || 
                        `server.${Date.now()}.${Math.random().toString(36).substring(2, 15)}`;

        const ga4Payload = {
          client_id: clientId,
          events: [{
            name: eventName,
            params: {
              ...ga4Params,
              ...eventParams,
              // Remove any undefined values
              ...Object.fromEntries(
                Object.entries({ ...ga4Params, ...eventParams })
                  .filter(([_, v]) => v !== undefined)
              ),
            },
          }],
        };

        const response = await fetch(
          `https://www.google-analytics.com/mp/collect?measurement_id=${GA4_MEASUREMENT_ID}&api_secret=${GA4_API_SECRET}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(ga4Payload),
          }
        );

        if (response.ok) {
          results.ga4 = { sent: true, status: response.status };
        } else {
          const errorText = await response.text();
          console.error('[Analytics Track] GA4 error:', response.status, errorText);
          results.ga4 = { sent: false, error: errorText };
        }
      } catch (error: any) {
        console.error('[Analytics Track] GA4 error:', error);
        results.ga4 = { sent: false, error: error.message };
      }
    } else {
      console.warn('[Analytics Track] GA4 not configured (missing MEASUREMENT_ID or API_SECRET)');
    }

    // Track in Meta Pixel via Conversion API (server-side)
    const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
    const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;

    if (META_PIXEL_ID && META_ACCESS_TOKEN && metaParams.email) {
      try {
        const crypto = await import('crypto');
        
        // Hash email for privacy
        const hashEmail = (email: string): string => {
          return crypto.createHash('sha256').update(email.toLowerCase().trim()).digest('hex');
        };

        const userData: any = {
          client_ip_address: request.headers.get('x-forwarded-for')?.split(',')[0] || 
                             request.headers.get('x-real-ip') || 
                             'unknown',
          client_user_agent: request.headers.get('user-agent') || 'unknown',
        };

        if (metaParams.email) {
          userData.em = [hashEmail(metaParams.email)];
        }
        if (metaParams.phone) {
          const phoneDigits = metaParams.phone.replace(/\D/g, '');
          if (phoneDigits) {
            userData.ph = [crypto.createHash('sha256').update(phoneDigits).digest('hex')];
          }
        }

        const eventData = {
          event_name: eventName === 'purchase' ? 'Purchase' : 
                     eventName === 'booking_created' ? 'AddToCart' :
                     eventName === 'select_package' ? 'ViewContent' :
                     eventName === 'begin_checkout' ? 'InitiateCheckout' : eventName,
          event_time: Math.floor(Date.now() / 1000),
          action_source: 'website',
          event_source_url: request.headers.get('referer') || 'unknown',
          user_data: userData,
          custom_data: {
            content_ids: metaParams.content_ids || [metaParams.package_id].filter(Boolean),
            content_type: 'product',
            value: metaParams.value || 0,
            currency: metaParams.currency || 'BDT',
          },
        };

        const metaResponse = await fetch(
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

        const metaResponseData = await metaResponse.json();

        if (metaResponse.ok) {
          results.meta = { 
            sent: true, 
            status: metaResponse.status,
            eventId: metaResponseData.events_received?.[0]?.event_id,
          };
        } else {
          console.error('[Analytics Track] Meta error:', metaResponseData);
          results.meta = { sent: false, error: metaResponseData.error?.message };
        }
      } catch (error: any) {
        console.error('[Analytics Track] Meta error:', error);
        results.meta = { sent: false, error: error.message };
      }
    } else if (metaParams.email) {
      console.warn('[Analytics Track] Meta Pixel not configured (missing PIXEL_ID or ACCESS_TOKEN)');
    }

    return NextResponse.json(results);
  } catch (error: any) {
    console.error('[Analytics Track] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to track event' },
      { status: 500 }
    );
  }
}