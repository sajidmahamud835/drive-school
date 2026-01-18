import { NextRequest, NextResponse } from 'next/server';

const GA4_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;
const GA4_API_SECRET = process.env.GA4_API_SECRET;

/**
 * Professional server-side conversion tracking endpoint
 * Tracks events to: GA4, Meta Pixel, TikTok Pixel, and Google Ads
 * All events sent from same domain (Vercel), avoiding third-party blocking
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      eventName,
      eventParams = {},
      ga4Params = {},
      metaParams = {},
      tiktokParams = {},
      googleAdsParams = {},
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
      tiktok: { sent: false },
      googleAds: { sent: false },
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

    // Track in TikTok Pixel via Events API (server-side)
    const TIKTOK_PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;
    const TIKTOK_ACCESS_TOKEN = process.env.TIKTOK_ACCESS_TOKEN;

    if (TIKTOK_PIXEL_ID && TIKTOK_ACCESS_TOKEN) {
      try {
        const crypto = await import('crypto');
        
        // Map event names to TikTok standard events
        const tiktokEventMap: Record<string, string> = {
          'purchase': 'CompletePayment',
          'booking_created': 'AddToCart',
          'select_package': 'ViewContent',
          'begin_checkout': 'InitiateCheckout',
          'page_view': 'ViewContent',
        };
        
        const tiktokEventName = tiktokEventMap[eventName] || eventName;

        // Hash email and phone for privacy
        const hashValue = (value: string): string => {
          return crypto.createHash('sha256').update(value.toLowerCase().trim()).digest('hex');
        };

        const userData: any = {
          ip: request.headers.get('x-forwarded-for')?.split(',')[0] || 
              request.headers.get('x-real-ip') || 
              undefined,
          user_agent: request.headers.get('user-agent') || undefined,
        };

        if (tiktokParams.email) {
          userData.email = hashValue(tiktokParams.email);
        }
        if (tiktokParams.phone) {
          const phoneDigits = tiktokParams.phone.replace(/\D/g, '');
          if (phoneDigits) {
            userData.phone_number = hashValue(phoneDigits);
          }
        }

        // Generate unique event ID for deduplication
        const eventId = `${eventName}_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

        const tiktokPayload = {
          pixel_code: TIKTOK_PIXEL_ID,
          event: tiktokEventName,
          event_id: eventId,
          timestamp: new Date().toISOString(),
          context: {
            page: {
              url: request.headers.get('referer') || 'unknown',
            },
            user: userData,
          },
          properties: {
            contents: tiktokParams.content_ids ? tiktokParams.content_ids.map((id: string) => ({
              content_id: id,
              content_type: 'product',
            })) : tiktokParams.package_id ? [{
              content_id: tiktokParams.package_id,
              content_type: 'product',
            }] : undefined,
            value: tiktokParams.value || tiktokParams.value || 0,
            currency: tiktokParams.currency || 'BDT',
            content_name: tiktokParams.content_name,
          },
        };

        // Remove undefined values
        Object.keys(tiktokPayload.properties).forEach(key => {
          if (tiktokPayload.properties[key as keyof typeof tiktokPayload.properties] === undefined) {
            delete tiktokPayload.properties[key as keyof typeof tiktokPayload.properties];
          }
        });

        const tiktokResponse = await fetch(
          'https://business-api.tiktok.com/open_api/v1.3/event/track/',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Access-Token': TIKTOK_ACCESS_TOKEN,
            },
            body: JSON.stringify({
              pixel_code: TIKTOK_PIXEL_ID,
              event: tiktokEventName,
              event_id: eventId,
              timestamp: new Date().toISOString(),
              context: {
                page: {
                  url: request.headers.get('referer') || 'unknown',
                },
                user: userData,
              },
              properties: tiktokPayload.properties,
            }),
          }
        );

        const tiktokResponseData = await tiktokResponse.json();

        if (tiktokResponse.ok && tiktokResponseData.message === 'OK') {
          results.tiktok = { 
            sent: true, 
            status: tiktokResponse.status,
            eventId: eventId,
          };
        } else {
          console.error('[Analytics Track] TikTok error:', tiktokResponseData);
          results.tiktok = { sent: false, error: tiktokResponseData.message || 'Unknown error' };
        }
      } catch (error: any) {
        console.error('[Analytics Track] TikTok error:', error);
        results.tiktok = { sent: false, error: error.message };
      }
    }

    // Track in Google Ads via Conversion API (server-side)
    const GOOGLE_ADS_CONVERSION_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID;
    const GOOGLE_ADS_CONVERSION_LABEL = process.env.GOOGLE_ADS_CONVERSION_LABEL;
    const GOOGLE_ADS_API_SECRET = process.env.GOOGLE_ADS_API_SECRET;

    // Only track purchase/conversion events for Google Ads
    if (GOOGLE_ADS_CONVERSION_ID && GOOGLE_ADS_CONVERSION_LABEL && GOOGLE_ADS_API_SECRET && eventName === 'purchase') {
      try {
        const crypto = await import('crypto');
        
        // Hash email and phone for Enhanced Conversions
        const hashValue = (value: string): string => {
          return crypto.createHash('sha256').update(value.toLowerCase().trim()).digest('hex');
        };

        const userData: any = {};
        if (googleAdsParams.email) {
          userData.email_address = hashValue(googleAdsParams.email);
        }
        if (googleAdsParams.phone) {
          const phoneDigits = googleAdsParams.phone.replace(/\D/g, '');
          if (phoneDigits) {
            userData.phone_number = hashValue(phoneDigits);
          }
        }

        // Get GCLID from query params or cookies (for attribution)
        const url = new URL(request.headers.get('referer') || 'https://example.com');
        const gclid = url.searchParams.get('gclid') || googleAdsParams.gclid;

        const googleAdsPayload: any = {
          conversion_id: GOOGLE_ADS_CONVERSION_ID.replace('AW-', ''),
          conversion_label: GOOGLE_ADS_CONVERSION_LABEL,
          value: googleAdsParams.value || 0,
          currency: googleAdsParams.currency || 'BDT',
        };

        if (gclid) {
          googleAdsPayload.gclid = gclid;
        }

        if (Object.keys(userData).length > 0) {
          googleAdsPayload.user_data = userData;
        }

        const googleAdsResponse = await fetch(
          `https://www.google.com/pagead/conversion/${GOOGLE_ADS_CONVERSION_ID.replace('AW-', '')}/?label=${GOOGLE_ADS_CONVERSION_LABEL}&value=${googleAdsParams.value || 0}&currency_code=${googleAdsParams.currency || 'BDT'}&api_secret=${GOOGLE_ADS_API_SECRET}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(googleAdsPayload),
          }
        );

        if (googleAdsResponse.ok) {
          results.googleAds = { sent: true, status: googleAdsResponse.status };
        } else {
          const errorText = await googleAdsResponse.text();
          console.error('[Analytics Track] Google Ads error:', googleAdsResponse.status, errorText);
          results.googleAds = { sent: false, error: errorText };
        }
      } catch (error: any) {
        console.error('[Analytics Track] Google Ads error:', error);
        results.googleAds = { sent: false, error: error.message };
      }
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