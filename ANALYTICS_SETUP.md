# Analytics Setup Guide

This guide will help you set up Google Analytics 4 (GA4) and Meta Pixel tracking for your driving school application.

## Overview

The application tracks:
- **Page views** (automatic on all pages)
- **Package selections** (when users click on package cards)
- **Booking creation** (when users successfully create a booking)
- **Sales/Conversions** (when admin confirms a booking)

## Prerequisites

- Google Analytics 4 account
- Meta Business account with Events Manager access
- Access to your Vercel project environment variables

---

## Part 1: Google Analytics 4 Setup

### Step 1: Get Your GA4 Measurement ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. Select your property (or create a new one)
3. Go to **Admin** (gear icon) → **Data Streams**
4. Click on your web stream
5. Copy your **Measurement ID** (format: `G-XXXXXXXXXX`)

### Step 2: Add to Environment Variables

**For Local Development:**
Add to your `.env.local` file:
```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**For Vercel Production:**
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add:
   - **Key**: `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - **Value**: Your GA4 Measurement ID (e.g., `G-XXXXXXXXXX`)
   - **Environment**: Production, Preview, Development (select all)
4. Click **Save**

**Note:** If you already have `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` set, the app will use that as a fallback. You can reuse the same ID if it's the same as your GA4 ID.

### Step 3: Verify GA4 Tracking

1. Deploy your changes to Vercel
2. Visit your website
3. Go to Google Analytics → **Reports** → **Realtime**
4. You should see your visit appear within a few seconds

---

## Part 2: Meta Pixel Setup

### Step 1: Create a Meta Pixel

1. Go to [Meta Events Manager](https://business.facebook.com/events_manager2)
2. Click **Connect Data Sources** → **Web**
3. Select **Meta Pixel**
4. Name your pixel (e.g., "Drive School Pixel")
5. Click **Create**
6. Copy your **Pixel ID** (numeric, e.g., `1234567890`)

### Step 2: Get Meta Access Token (for Conversion API)

1. In Events Manager, go to **Settings** → **Conversions API**
2. Click **Set up manually** or **Generate access token**
3. Copy the **Access Token** (keep this secure!)

**Important:** The access token is used for server-side conversion tracking, which improves tracking accuracy and helps with iOS 14.5+ privacy changes.

### Step 3: Add to Environment Variables

**For Local Development:**
Add to your `.env.local` file:
```env
NEXT_PUBLIC_META_PIXEL_ID=1234567890
META_ACCESS_TOKEN=your_access_token_here
```

**For Vercel Production:**
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add both variables:
   - **Key**: `NEXT_PUBLIC_META_PIXEL_ID`
     - **Value**: Your Pixel ID (e.g., `1234567890`)
     - **Environment**: Production, Preview, Development
   - **Key**: `META_ACCESS_TOKEN`
     - **Value**: Your access token
     - **Environment**: Production, Preview, Development
     - **Note**: This is sensitive - don't commit to Git!
4. Click **Save** for each

### Step 4: Verify Meta Pixel Tracking

1. Deploy your changes to Vercel
2. Install the [Meta Pixel Helper Chrome Extension](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)
3. Visit your website
4. The extension should show:
   - ✅ Pixel loaded
   - ✅ PageView event fired
5. In Events Manager → **Test Events**, you should see events appearing

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

### GA4 Not Tracking

**Issue:** No events in GA4 Realtime
- **Check:** Verify `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set correctly
- **Check:** Open browser DevTools → Network tab → Filter "gtag" → Should see requests to `google-analytics.com`
- **Check:** Ensure scripts are loading in `<head>` (view page source)

### Meta Pixel Not Tracking

**Issue:** Pixel Helper shows no pixel
- **Check:** Verify `NEXT_PUBLIC_META_PIXEL_ID` is set correctly
- **Check:** Open browser DevTools → Network tab → Filter "fbevents" → Should see requests to `facebook.net`
- **Check:** Ensure Meta Pixel script is in `<head>` (view page source)

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

- [ ] GA4 Measurement ID obtained and added to environment variables
- [ ] Meta Pixel created and Pixel ID added to environment variables
- [ ] Meta Access Token generated and added to environment variables
- [ ] All environment variables set in Vercel
- [ ] Deployed to production
- [ ] Verified page views in GA4 Realtime
- [ ] Verified PageView in Meta Events Manager
- [ ] Tested package selection tracking
- [ ] Tested booking creation tracking
- [ ] Tested conversion tracking (admin confirm)

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