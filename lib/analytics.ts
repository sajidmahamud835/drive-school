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
 */
async function sendServerSideEvent(
  eventName: string,
  eventParams: Record<string, any> = {},
  ga4Params: Record<string, any> = {},
  metaParams: Record<string, any> = {}
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
 * Track package selection
 */
export function trackPackageSelect(
  packageId: string,
  packageName: string,
  price?: number
): void {
  trackEvent('select_package', {
    package_id: packageId,
    package_name: packageName,
    value: price,
    currency: 'BDT',
  });

  // Also track in Meta Pixel
  if (isBrowser() && META_PIXEL_ID && window.fbq) {
    try {
      window.fbq('track', 'ViewContent', {
        content_name: packageName,
        content_ids: [packageId],
        content_type: 'product',
        value: price,
        currency: 'BDT',
      });
    } catch (error) {
      console.error('Error tracking package select in Meta Pixel:', error);
    }
  }
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
 */
export function trackBookingCreated(
  bookingId: string,
  packageId: string,
  value?: number
): void {
  trackEvent('booking_created', {
    booking_id: bookingId,
    package_id: packageId,
    value: value,
    currency: 'BDT',
  });

  if (isBrowser() && META_PIXEL_ID && window.fbq) {
    try {
      window.fbq('track', 'AddToCart', {
        content_ids: [packageId],
        content_type: 'product',
        value: value,
        currency: 'BDT',
      });
    } catch (error) {
      console.error('Error tracking booking created in Meta Pixel:', error);
    }
  }
}

/**
 * Track booking confirmed (sale conversion)
 */
export function trackBookingConfirmed(
  bookingId: string,
  packageId: string,
  value?: number
): void {
  trackEvent('purchase', {
    transaction_id: bookingId,
    package_id: packageId,
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
