# Client-Side Tracking Test Guide

This guide helps you verify that client-side tracking (GTM) is working correctly after deployment.

## Pre-Deployment Checklist

Before testing, ensure:
- [ ] GTM container is published (not just saved)
- [ ] All Data Layer Variables are created in GTM
- [ ] All tags are configured and enabled
- [ ] Website is deployed to Vercel

## Testing Tools

### 1. Browser DevTools (Network Tab)

Open your deployed website and check:

1. **GTM Container Loading**
   - Open DevTools → Network tab
   - Filter: `gtm.js`
   - Refresh page
   - Should see: `gtm.js?id=GTM-PZLZB6CX` with status 200

2. **GA4 Requests**
   - Filter: `google-analytics.com` or `collect`
   - Navigate through site
   - Should see requests to `analytics.google.com/g/collect`

3. **Meta Pixel Requests**
   - Filter: `facebook.net` or `fb`
   - Should see requests to `facebook.com/tr`

4. **TikTok Pixel Requests**
   - Filter: `tiktok.com` or `analytics.tiktok.com`
   - Should see requests to `analytics.tiktok.com`

5. **Google Ads Requests**
   - Filter: `googleadservices.com` or `pagead`
   - Should see conversion tracking requests

### 2. GTM Preview Mode (Best for Testing)

1. **Open GTM Preview**
   - Go to [Google Tag Manager](https://tagmanager.google.com/)
   - Click **Preview** button
   - Enter your deployed website URL
   - Click **Connect**

2. **Test Page View**
   - Navigate to your website
   - In GTM Preview panel, verify:
     - ✅ `gtm.js` loaded
     - ✅ `PageView` event fired
     - ✅ GA4 Configuration tag fired
     - ✅ Meta Pixel base tag fired
     - ✅ TikTok Pixel base tag fired

3. **Test Package Selection**
   - Click on a package
   - In GTM Preview, verify:
     - ✅ `select_package` event appears
     - ✅ Data Layer shows: `package_id`, `package_name`, `value`
     - ✅ GA4 - Select Package tag fired
     - ✅ Meta Pixel - ViewContent tag fired
     - ✅ TikTok Pixel - ViewContent tag fired

4. **Test Booking Created**
   - Complete booking form
   - Submit booking
   - In GTM Preview, verify:
     - ✅ `booking_created` event appears
     - ✅ Data Layer shows: `booking_id`, `package_id`, `value`
     - ✅ GA4 - Booking Created tag fired
     - ✅ Meta Pixel - AddToCart tag fired
     - ✅ TikTok Pixel - AddToCart tag fired

5. **Test Purchase Event** (Admin Action)
   - Admin confirms booking
   - In GTM Preview (if admin panel is accessible), verify:
     - ✅ `purchase` event appears
     - ✅ Data Layer shows: `transaction_id`, `package_id`, `value`
     - ✅ GA4 - Purchase tag fired
     - ✅ Meta Pixel - Purchase tag fired
     - ✅ TikTok Pixel - CompletePayment tag fired
     - ✅ Google Ads Conversion tag fired

### 3. Browser Console (DataLayer Inspection)

Open browser console and run:

```javascript
// Check if dataLayer exists
console.log(window.dataLayer);

// Check latest event
console.log(window.dataLayer[window.dataLayer.length - 1]);

// Monitor all dataLayer pushes
window.dataLayer.push = (function(originalPush) {
  return function() {
    console.log('dataLayer.push:', arguments);
    return originalPush.apply(this, arguments);
  };
})(window.dataLayer.push);
```

### 4. Platform-Specific Testing

#### Google Analytics 4 (GA4)

1. Go to [Google Analytics](https://analytics.google.com/)
2. **Reports** → **Realtime**
3. Navigate your website
4. Should see:
   - Active users
   - Events: `page_view`, `select_package`, `booking_created`, `purchase`

**Test Events:**
- Visit landing page → Should see `page_view`
- Click package → Should see `select_package`
- Create booking → Should see `booking_created`
- Admin confirms → Should see `purchase`

#### Meta Pixel (Facebook/Instagram)

1. Go to [Meta Events Manager](https://business.facebook.com/events_manager2)
2. Select your Pixel
3. Click **Test Events** tab
4. Enter your website URL
5. Navigate and interact
6. Should see events in real-time:
   - `PageView`
   - `ViewContent` (package selection)
   - `AddToCart` (booking created)
   - `Purchase` (booking confirmed)

**Note**: Test Events only works for 72 hours after enabling.

#### TikTok Pixel

1. Go to [TikTok Ads Manager](https://ads.tiktok.com/)
2. **Assets** → **Events** → **Web Events**
3. Select your Pixel
4. Click **Test Events** tab
5. Navigate your website
6. Should see events:
   - `ViewContent`
   - `AddToCart`
   - `CompletePayment`

#### Google Ads

1. Go to [Google Ads](https://ads.google.com/)
2. **Tools & Settings** → **Conversions**
3. Select your conversion action
4. Check **Status**: Should show "Recording conversions"
5. **Note**: Conversions may take 24-48 hours to appear

## Common Issues & Fixes

### Issue: GTM Container Not Loading

**Symptoms:**
- No `gtm.js` request in Network tab
- No dataLayer in console

**Fixes:**
- ✅ Verify GTM container ID in `app/layout.tsx` is correct
- ✅ Check if container is published (not just saved)
- ✅ Clear browser cache
- ✅ Check browser console for errors

### Issue: Tags Not Firing

**Symptoms:**
- GTM loads but tags don't fire
- No events in platform dashboards

**Fixes:**
- ✅ Check triggers are set correctly
- ✅ Verify Data Layer Variables exist
- ✅ Check tag conditions/triggers
- ✅ Use GTM Preview to debug

### Issue: Variables Show "undefined"

**Symptoms:**
- Tags fire but with undefined values
- Events appear but missing data

**Fixes:**
- ✅ Verify Data Layer Variable names match exactly
- ✅ Check dataLayer structure in Preview mode
- ✅ Ensure variables are created before tags
- ✅ Check variable Data Layer Version (should be Version 2)

### Issue: Events Not Appearing in Platforms

**Symptoms:**
- Tags fire in GTM Preview
- But no events in GA4/Meta/TikTok dashboards

**Fixes:**
- ✅ Wait 5-10 minutes for GA4 (real-time can be delayed)
- ✅ Check Meta Test Events (only works for 72 hours)
- ✅ Verify Pixel IDs are correct
- ✅ Check ad blockers (disable for testing)
- ✅ Verify tags are published (not just in workspace)

## Quick Test Script

Run this in browser console on your deployed site:

```javascript
// Test dataLayer
console.log('dataLayer exists:', !!window.dataLayer);
console.log('dataLayer length:', window.dataLayer?.length);

// Test GTM
console.log('GTM loaded:', !!window.google_tag_manager);

// Test GA4
console.log('GA4 loaded:', !!window.gtag);

// Test Meta Pixel
console.log('Meta Pixel loaded:', !!window.fbq);

// Test TikTok Pixel
console.log('TikTok Pixel loaded:', !!window.ttq);

// Push test event
window.dataLayer.push({
  event: 'test_event',
  test: true
});
console.log('Test event pushed. Check GTM Preview.');
```

## Success Criteria

✅ **GTM Container**: Loads on every page  
✅ **Page View**: Fires on page load  
✅ **Package Selection**: Fires when package clicked  
✅ **Booking Created**: Fires when booking submitted  
✅ **Purchase**: Fires when admin confirms booking  
✅ **Data Layer Variables**: All populated correctly  
✅ **Platform Dashboards**: Events appear within expected timeframe  

## Next Steps

After client-side tracking is verified:
1. Test server-side tracking (see `CONVERSION_TRACKING_SETUP.md`)
2. Verify Enhanced Conversions (email/phone hashing)
3. Check for duplicate events (client + server)
4. Monitor conversion rates in each platform
5. Set up alerts for tracking failures

---

**Need Help?** Check:
- `CONVERSION_TRACKING_SETUP.md` - Full setup guide
- `GTM_TAG_TEMPLATES.md` - Tag templates
- `QUICK_START_ANALYTICS.md` - Quick setup guide