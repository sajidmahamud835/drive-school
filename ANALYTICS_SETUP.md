# Analytics Setup Guide

This guide will help you set up Google Tag Manager (GTM), Google Analytics 4 (GA4), and Meta Pixel tracking for your driving school application.

## Overview

The application tracks:
- **Page views** (automatic on all pages)
- **Package selections** (when users click on package cards)
- **Booking creation** (when users successfully create a booking)
- **Sales/Conversions** (when admin confirms a booking)

## Prerequisites

- Google Tag Manager account (GTM container: `GTM-PZLZB6CX`)
- Google Analytics 4 account (to be configured in GTM)
- Meta Business account with Events Manager access (to be configured in GTM)

---

## Part 0: Google Tag Manager (Default Tracking Method)

**Google Tag Manager is the default and only tracking method** in the application. All analytics events are sent to GTM's `dataLayer`, and you configure which tags (GA4, Meta Pixel, etc.) fire in the GTM dashboard.

### What is GTM?

Google Tag Manager allows you to manage multiple tracking tags (GA4, Meta Pixel, etc.) from a single dashboard without code changes. The GTM container (`GTM-PZLZB6CX`) is already embedded in the application.

### How It Works

The application pushes events to GTM's `dataLayer`. You then configure tags in GTM to:
- Listen for specific events
- Send data to GA4, Meta Pixel, or other platforms
- Set up triggers and variables

### Setting Up Tags in GTM

1. **Go to [Google Tag Manager](https://tagmanager.google.com/)**
2. **Select your container** (`GTM-PZLZB6CX`)
3. **Set up GA4:**
   - Go to **Tags** → **New**
   - Choose **Google Analytics: GA4 Configuration**
   - Enter your GA4 Measurement ID
   - Set trigger to **All Pages** (for page views)
   - Create additional GA4 Event tags for custom events (see Event Reference below)

4. **Set up Meta Pixel:**
   - Go to **Tags** → **New**
   - Choose **Custom HTML** tag
   - Paste your Meta Pixel base code
   - Set trigger to **All Pages**
   - Create additional Meta Pixel Event tags for custom events

---

## Part 1: Setting Up GA4 in GTM

### Step 1: Get Your GA4 Measurement ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. Select your property (or create a new one)
3. Go to **Admin** (gear icon) → **Data Streams**
4. Click on your web stream
5. Copy your **Measurement ID** (format: `G-XXXXXXXXXX`)

### Step 2: Create GA4 Configuration Tag in GTM

1. Go to [Google Tag Manager](https://tagmanager.google.com/)
2. Select your container (`GTM-PZLZB6CX`)
3. Click **Tags** → **New**
4. Name it: "GA4 Configuration"
5. Choose **Google Analytics: GA4 Configuration**
6. Enter your Measurement ID: `G-XXXXXXXXXX`
7. Set trigger to **All Pages**
8. Click **Save**

### Step 3: Create GA4 Event Tags

For each custom event, create a GA4 Event tag:

**Example: Package Selection Event**
1. **Tags** → **New** → Name: "GA4 - Select Package"
2. Choose **Google Analytics: GA4 Event**
3. Configuration Tag: Select "GA4 Configuration" (from step 2)
4. Event Name: `select_package`
5. Set up Event Parameters:
   - `package_id`: `{{package_id}}` (create a Data Layer Variable)
   - `package_name`: `{{package_name}}`
   - `value`: `{{value}}`
   - `currency`: `BDT`
6. Trigger: Create a Custom Event trigger with Event name: `select_package`

Repeat for other events: `booking_created`, `purchase`, etc.

### Step 4: Verify GA4 Tracking

1. Use GTM Preview mode to test
2. Visit your website
3. Go to Google Analytics → **Reports** → **Realtime**
4. You should see events appearing

---

## Part 2: Setting Up Meta Pixel in GTM

### Step 1: Create a Meta Pixel

1. Go to [Meta Events Manager](https://business.facebook.com/events_manager2)
2. Click **Connect Data Sources** → **Web**
3. Select **Meta Pixel**
4. Name your pixel (e.g., "Drive School Pixel")
5. Click **Create**
6. Copy your **Pixel ID** (numeric, e.g., `1234567890`)

### Step 2: Create Meta Pixel Base Tag in GTM

1. In GTM, go to **Tags** → **New**
2. Name it: "Meta Pixel - Base Code"
3. Choose **Custom HTML**
4. Paste the Meta Pixel base code (replace `YOUR_PIXEL_ID` with your actual Pixel ID):
```html
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'YOUR_PIXEL_ID');
fbq('track', 'PageView');
</script>
```
5. Set trigger to **All Pages**
6. Click **Save**

### Step 3: Create Meta Pixel Event Tags

For each custom event, create a Meta Pixel Event tag:

**Example: ViewContent Event (Package Selection)**
1. **Tags** → **New** → Name: "Meta Pixel - ViewContent"
2. Choose **Custom HTML**
3. Paste:
```html
<script>
fbq('track', 'ViewContent', {
  content_name: '{{package_name}}',
  content_ids: ['{{package_id}}'],
  content_type: 'product',
  value: {{value}},
  currency: 'BDT'
});
</script>
```
4. Trigger: Custom Event trigger with Event name: `select_package`

### Step 4: Verify Meta Pixel Tracking

1. Use GTM Preview mode
2. Install [Meta Pixel Helper Chrome Extension](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)
3. Visit your website
4. The extension should show events firing
5. In Events Manager → **Test Events**, you should see events appearing

---

## Part 2.5: Server-Side Tracking Setup (Recommended)

**The application now uses dual tracking for maximum reliability:**
- **Client-side**: Via GTM dataLayer (works when browsers allow third-party tracking)
- **Server-side**: Via API routes on the same domain (avoids third-party blocking)

This ensures tracking works even when browsers block third-party cookies/scripts.

### Step 1: Get GA4 API Secret (for server-side GA4 tracking)

1. Go to [Google Analytics](https://analytics.google.com/)
2. **Admin** → **Data Streams** → Select your web stream
3. Scroll down to **Measurement Protocol API secrets**
4. Click **Create** → Name it (e.g., "Server-side tracking")
5. Copy the **Secret value** (you'll only see it once!)

### Step 2: Get Meta Access Token (for server-side Meta tracking)

1. In Events Manager, go to **Settings** → **Conversions API**
2. Click **Set up manually** or **Generate access token**
3. Copy the **Access Token** (keep this secure!)

### Step 3: Add Environment Variables

**For Vercel Production:**
1. Go to Vercel project dashboard → **Settings** → **Environment Variables**
2. Add all four variables:
   - **Key**: `GA4_API_SECRET`
     - **Value**: Your GA4 API secret (from Step 1)
     - **Environment**: Production, Preview, Development
   - **Key**: `META_ACCESS_TOKEN`
     - **Value**: Your Meta access token (from Step 2)
     - **Environment**: Production, Preview, Development
   - **Key**: `NEXT_PUBLIC_GA_MEASUREMENT_ID` (if not already set)
   - **Key**: `NEXT_PUBLIC_META_PIXEL_ID` (if not already set)
3. Click **Save** for each

**How It Works:**
- Events are sent to both client-side (GTM dataLayer) and server-side (`/api/analytics/track`)
- Server-side events are sent from your Vercel domain, avoiding third-party blocking
- Both methods run in parallel for maximum coverage

---

## Part 3: Testing Analytics

### Test Page Views

1. Visit your landing page (`/`)
2. Check GA4 Realtime reports - should see page view
3. Check Meta Events Manager Test Events - should see PageView

### Test Package Selection

1. Go to `/booking`
2. Click on a package card
3. Check GA4 Events - should see `select_package` event
4. Check Meta Events Manager - should see `ViewContent` event

### Test Booking Creation

1. Complete a booking flow
2. After booking is created, check:
   - GA4 Events - should see `booking_created` event
   - Meta Events Manager - should see `AddToCart` event

### Test Conversion (Admin Only)

1. As admin, confirm a booking in the admin panel
2. Check:
   - GA4 Events - should see `purchase` event
   - Meta Events Manager - should see `Purchase` event (both client and server-side)

---

## Part 4: Troubleshooting

### GTM Not Loading

**Issue:** GTM container not loading
- **Check:** Verify GTM container ID `GTM-PZLZB6CX` is correct
- **Check:** Open browser DevTools → Network tab → Filter "gtm.js" → Should see request to `googletagmanager.com`
- **Check:** Ensure GTM script is in `<head>` (view page source)
- **Check:** Use GTM Preview mode to debug

### GA4 Not Tracking

**Issue:** No events in GA4 Realtime
- **Check:** Verify GA4 Configuration tag is set up in GTM
- **Check:** Verify GA4 Measurement ID is correct in GTM tag
- **Check:** Use GTM Preview mode to see if tags are firing
- **Check:** Open browser DevTools → Network tab → Filter "google-analytics.com" → Should see requests

### Meta Pixel Not Tracking

**Issue:** Pixel Helper shows no pixel
- **Check:** Verify Meta Pixel base tag is set up in GTM
- **Check:** Verify Pixel ID is correct in GTM tag
- **Check:** Use GTM Preview mode to see if tags are firing
- **Check:** Open browser DevTools → Network tab → Filter "fbevents" → Should see requests to `facebook.net`

### Conversion API Not Working

**Issue:** Client-side events work but server-side doesn't
- **Check:** Verify `META_ACCESS_TOKEN` is set in Vercel (not just local)
- **Check:** Check Vercel function logs for errors
- **Check:** Verify access token hasn't expired (regenerate if needed)

### Events Not Appearing

**Issue:** Events not showing in dashboards
- **Wait:** GA4 can take 24-48 hours for non-realtime reports
- **Check:** Use Realtime reports for immediate verification
- **Check:** Ensure you're looking at the correct property/pixel
- **Check:** Browser ad blockers may prevent tracking (test in incognito)

---

## Part 5: Event Reference

### Google Analytics 4 Events

| Event Name | When It Fires | Parameters |
|------------|---------------|------------|
| `page_view` | Every page navigation | `page_path`, `page_title` |
| `select_package` | User clicks package card | `package_id`, `package_name`, `value`, `currency` |
| `begin_checkout` | User starts booking flow | `package_id` |
| `booking_created` | Booking successfully created | `booking_id`, `package_id`, `value`, `currency` |
| `purchase` | Admin confirms booking | `transaction_id`, `package_id`, `value`, `currency` |

### Meta Pixel Events

| Event Name | When It Fires | Parameters |
|------------|---------------|------------|
| `PageView` | Every page load | Standard |
| `ViewContent` | User clicks package card | `content_name`, `content_ids`, `value`, `currency` |
| `InitiateCheckout` | User starts booking flow | `content_ids` |
| `AddToCart` | Booking successfully created | `content_ids`, `value`, `currency` |
| `Purchase` | Admin confirms booking | `content_ids`, `value`, `currency` |

---

## Part 6: Best Practices

1. **Test in Development First**
   - Set up analytics in local `.env.local`
   - Test all events before deploying

2. **Monitor Regularly**
   - Check GA4 Realtime reports daily
   - Review Meta Events Manager weekly
   - Set up alerts for tracking failures

3. **Privacy Compliance**
   - Add cookie consent banner if required in your region
   - Update privacy policy to mention analytics tracking
   - Consider implementing consent management

4. **Performance**
   - Analytics scripts load asynchronously (won't block page)
   - Server-side conversion tracking doesn't affect user experience

5. **Security**
   - Never commit access tokens to Git
   - Rotate access tokens periodically
   - Use environment variables for all sensitive data

---

## Quick Checklist

- [ ] GTM container verified (`GTM-PZLZB6CX`)
- [ ] GA4 Measurement ID obtained
- [ ] GA4 Configuration tag created in GTM
- [ ] GA4 Event tags created for custom events
- [ ] Meta Pixel created
- [ ] Meta Pixel base tag created in GTM
- [ ] Meta Pixel event tags created for custom events
- [ ] GTM Preview mode tested
- [ ] Verified page views in GA4 Realtime
- [ ] Verified PageView in Meta Events Manager
- [ ] Tested package selection tracking
- [ ] Tested booking creation tracking
- [ ] Tested conversion tracking (admin confirm)
- [ ] GTM container published

---

## Support

If you encounter issues:
1. Check browser console for errors
2. Check Vercel function logs
3. Use browser DevTools Network tab to verify requests
4. Check GA4 DebugView for detailed event data
5. Use Meta Events Manager Test Events for real-time verification

For more information:
- [GA4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [Meta Pixel Documentation](https://developers.facebook.com/docs/meta-pixel)
- [Meta Conversions API Documentation](https://developers.facebook.com/docs/marketing-api/conversions-api)