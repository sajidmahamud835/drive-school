/**
 * Analytics utility for Google Analytics 4 and Meta Pixel
 * Provides typed event tracking functions
 */

// Declare gtag and fbq types for TypeScript
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'set',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
    fbq?: (
      command: 'init' | 'track' | 'trackCustom',
      eventName: string,
      params?: Record<string, any>
    ) => void;
    dataLayer?: any[];
  }
}

// Get analytics IDs from environment variables
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

/**
 * Check if we're in the browser and analytics are available
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Track page view in GA4
 */
export function trackPageView(url: string, title?: string): void {
  if (!isBrowser() || !GA_MEASUREMENT_ID || !window.gtag) {
    return;
  }

  try {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
      page_title: title,
    });
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
}

/**
 * Track custom event in GA4
 */
export function trackEvent(
  eventName: string,
  eventParams?: Record<string, any>
): void {
  if (!isBrowser() || !GA_MEASUREMENT_ID || !window.gtag) {
    return;
  }

  try {
    window.gtag('event', eventName, eventParams);
  } catch (error) {
    console.error('Error tracking event:', error);
  }
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

  if (isBrowser() && META_PIXEL_ID && window.fbq) {
    try {
      window.fbq('track', 'InitiateCheckout', {
        content_ids: [packageId],
        content_type: 'product',
      });
    } catch (error) {
      console.error('Error tracking booking initiated in Meta Pixel:', error);
    }
  }
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

  if (isBrowser() && META_PIXEL_ID && window.fbq) {
    try {
      window.fbq('track', 'Purchase', {
        content_ids: [packageId],
        content_type: 'product',
        value: value,
        currency: 'BDT',
      });
    } catch (error) {
      console.error('Error tracking booking confirmed in Meta Pixel:', error);
    }
  }
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
