/**
 * Analytics utility for Google Tag Manager (GTM)
 * All tracking is done via GTM's dataLayer
 */

// Declare dataLayer type for TypeScript
declare global {
  interface Window {
    dataLayer?: any[];
  }
}

/**
 * Check if we're in the browser and dataLayer is available
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Push event to GTM dataLayer
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
 * Track page view via GTM
 */
export function trackPageView(url: string, title?: string): void {
  if (!isBrowser()) {
    return;
  }

  pushToDataLayer({
    event: 'page_view',
    page_path: url,
    page_title: title,
  });
}

/**
 * Track custom event via GTM
 */
export function trackEvent(
  eventName: string,
  eventParams?: Record<string, any>
): void {
  if (!isBrowser()) {
    return;
  }

  pushToDataLayer({
    event: eventName,
    ...eventParams,
  });
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
