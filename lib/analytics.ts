/**
 * Analytics utility for dual tracking:
 * 1. Client-side via GTM dataLayer (for browsers that allow it)
 * 2. Server-side via API routes (same domain, avoids third-party blocking)
 */

// Declare dataLayer type for TypeScript
declare global {
  interface Window {
    dataLayer?: any[];
  }
}

/**
 * Check if we're in the browser
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Push event to GTM dataLayer (client-side)
 */
function pushToDataLayer(data: Record<string, any>): void {
  if (!isBrowser() || !window.dataLayer) {
    return;
  }

  try {
    window.dataLayer.push(data);
  } catch (error) {
    console.error('Error pushing to dataLayer:', error);
  }
}

/**
 * Send event to server-side tracking API (same domain)
 * Supports: GA4, Meta Pixel, TikTok Pixel, Google Ads
 */
async function sendServerSideEvent(
  eventName: string,
  eventParams: Record<string, any> = {},
  ga4Params: Record<string, any> = {},
  metaParams: Record<string, any> = {},
  tiktokParams: Record<string, any> = {},
  googleAdsParams: Record<string, any> = {}
): Promise<void> {
  if (!isBrowser()) {
    return;
  }

  try {
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventName,
        eventParams,
        ga4Params,
        metaParams,
        tiktokParams,
        googleAdsParams,
      }),
    }).catch((error) => {
      // Log but don't throw - server-side tracking failure shouldn't break the app
      console.error('[Analytics] Server-side tracking error:', error);
    });
  } catch (error) {
    console.error('[Analytics] Server-side tracking error:', error);
  }
}

/**
 * Track page view via both client-side and server-side
 */
export function trackPageView(url: string, title?: string): void {
  if (!isBrowser()) {
    return;
  }

  // Client-side tracking (GTM)
  pushToDataLayer({
    event: 'page_view',
    page_path: url,
    page_title: title,
  });

  // Server-side tracking (same domain)
  sendServerSideEvent('page_view', {
    page_path: url,
    page_title: title,
  });
}

/**
 * Track custom event via both client-side and server-side
 */
export function trackEvent(
  eventName: string,
  eventParams?: Record<string, any>
): void {
  if (!isBrowser()) {
    return;
  }

  // Client-side tracking (GTM)
  pushToDataLayer({
    event: eventName,
    ...eventParams,
  });

  // Server-side tracking (same domain)
  sendServerSideEvent(eventName, eventParams || {});
}

/**
 * Track package selection (client-side + server-side)
 * Tracks to: GA4, Meta Pixel, TikTok Pixel, Google Ads (via GTM)
 */
export function trackPackageSelect(
  packageId: string,
  packageName: string,
  price?: number
): void {
  const eventParams = {
    package_id: packageId,
    package_name: packageName,
    value: price,
    currency: 'BDT',
  };

  // Client-side tracking (GTM) - will fire tags for all platforms
  pushToDataLayer({
    event: 'select_package',
    ...eventParams,
  });

  // Server-side tracking (same domain) - bypasses third-party blocking
  sendServerSideEvent('select_package', eventParams, eventParams, {
    content_name: packageName,
    content_ids: [packageId],
    content_type: 'product',
    value: price,
    currency: 'BDT',
  }, {
    content_name: packageName,
    content_ids: [packageId],
    package_id: packageId,
    value: price,
    currency: 'BDT',
  });
}

/**
 * Track booking initiated (when user starts booking flow)
 */
export function trackBookingInitiated(packageId: string): void {
  trackEvent('begin_checkout', {
    package_id: packageId,
  });
}

/**
 * Track booking created (when booking is successfully created)
 * Requires email/phone for server-side tracking (Meta, TikTok, Google Ads Enhanced Conversions)
 */
export function trackBookingCreated(
  bookingId: string,
  packageId: string,
  value?: number,
  email?: string,
  phone?: string
): void {
  const eventParams = {
    booking_id: bookingId,
    package_id: packageId,
    value: value,
    currency: 'BDT',
  };

  // Client-side tracking (GTM) - will fire tags for all platforms
  pushToDataLayer({
    event: 'booking_created',
    ...eventParams,
  });

  // Server-side tracking (same domain) - bypasses third-party blocking
  sendServerSideEvent('booking_created', eventParams, eventParams, {
    email,
    phone,
    content_ids: [packageId],
    content_type: 'product',
    value: value,
    currency: 'BDT',
  }, {
    email,
    phone,
    content_ids: [packageId],
    package_id: packageId,
    value: value,
    currency: 'BDT',
  });
}

/**
 * Track booking confirmed (sale conversion)
 * Critical conversion event - tracks to all platforms
 */
export function trackBookingConfirmed(
  bookingId: string,
  packageId: string,
  value?: number,
  email?: string,
  phone?: string
): void {
  const eventParams = {
    transaction_id: bookingId,
    package_id: packageId,
    value: value,
    currency: 'BDT',
  };

  // Client-side tracking (GTM) - will fire conversion tags
  pushToDataLayer({
    event: 'purchase',
    ...eventParams,
  });

  // Server-side tracking (same domain) - critical for conversion attribution
  sendServerSideEvent('purchase', eventParams, eventParams, {
    email,
    phone,
    content_ids: [packageId],
    content_type: 'product',
    value: value,
    currency: 'BDT',
  }, {
    email,
    phone,
    content_ids: [packageId],
    package_id: packageId,
    value: value,
    currency: 'BDT',
  }, {
    email,
    phone,
    value: value,
    currency: 'BDT',
  });
}

/**
 * Track booking rejected
 */
export function trackBookingRejected(bookingId: string): void {
  trackEvent('booking_rejected', {
    booking_id: bookingId,
  });
}

/**
 * Track form interaction (e.g., address autofill)
 */
export function trackFormInteraction(interactionType: string, details?: Record<string, any>): void {
  trackEvent('form_interaction', {
    interaction_type: interactionType,
    ...details,
  });
}
