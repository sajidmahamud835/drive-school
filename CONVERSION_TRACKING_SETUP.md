# Professional Conversion Tracking Setup Guide

This guide provides expert-level setup instructions for multi-platform conversion tracking via Google Tag Manager (GTM) with server-side backup.

## Overview

The application implements **dual-layer conversion tracking**:
- **Client-side**: Via GTM dataLayer (works when browsers allow third-party tracking)
- **Server-side**: Via same-domain API routes (bypasses third-party blocking)

**Platforms Tracked:**
- Google Analytics 4 (GA4)
- Meta Pixel (Facebook/Instagram Ads)
- TikTok Pixel (TikTok Ads)
- Google Ads (Conversion Tracking)

---

## Part 1: Google Tag Manager Setup (Client-Side)

### Step 1: Access Your GTM Container

1. Go to [Google Tag Manager](https://tagmanager.google.com/)
2. Select container: `GTM-PZLZB6CX`
3. Ensure you have **Edit** permissions

### Step 2: Set Up GA4 in GTM

1. **Tags** → **New** → Name: "GA4 Configuration"
2. Tag Type: **Google Analytics: GA4 Configuration**
3. Measurement ID: `G-XXXXXXXXXX` (your GA4 ID)
4. Trigger: **All Pages**
5. **Save**

**Create GA4 Event Tags:**
- **GA4 - Select Package**: Event `select_package`, trigger on Custom Event `select_package`
- **GA4 - Booking Created**: Event `booking_created`, trigger on Custom Event `booking_created`
- **GA4 - Purchase**: Event `purchase`, trigger on Custom Event `purchase`

### Step 3: Set Up Meta Pixel in GTM

1. **Tags** → **New** → Name: "Meta Pixel - Base Code"
2. Tag Type: **Custom HTML**
3. Paste base code (replace `YOUR_PIXEL_ID`):
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
4. Trigger: **All Pages**
5. **Save**

**Create Meta Pixel Event Tags:**
- **Meta Pixel - ViewContent**: `fbq('track', 'ViewContent', {...})`, trigger on `select_package`
- **Meta Pixel - AddToCart**: `fbq('track', 'AddToCart', {...})`, trigger on `booking_created`
- **Meta Pixel - Purchase**: `fbq('track', 'Purchase', {...})`, trigger on `purchase`

### Step 4: Set Up TikTok Pixel in GTM

1. **Tags** → **New** → Name: "TikTok Pixel - Base Code"
2. Tag Type: **Custom HTML**
3. Paste base code (replace `YOUR_PIXEL_ID`):
```html
<script>
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
  ttq.load('YOUR_PIXEL_ID');
  ttq.page();
}(window, document, 'ttq');
</script>
```
4. Trigger: **All Pages**
5. **Save**

**Create TikTok Pixel Event Tags:**
- **TikTok Pixel - ViewContent**: `ttq.track('ViewContent', {...})`, trigger on `select_package`
- **TikTok Pixel - AddToCart**: `ttq.track('AddToCart', {...})`, trigger on `booking_created`
- **TikTok Pixel - CompletePayment**: `ttq.track('CompletePayment', {...})`, trigger on `purchase`

### Step 5: Set Up Google Ads Conversion Tracking in GTM

1. **Tags** → **New** → Name: "Google Ads - Conversion"
2. Tag Type: **Google Ads Conversion Tracking**
3. Conversion ID: `AW-XXXXXXXXXX` (your Conversion ID)
4. Conversion Label: `your_conversion_label`
5. Conversion Value: Use Data Layer Variable `{{value}}`
6. Currency Code: `BDT`
7. Trigger: Custom Event `purchase`
8. **Save**

**For Enhanced Conversions:**
- Enable "User-provided data"
- Map email/phone from Data Layer Variables
- Ensure Consent Mode allows `ad_user_data`

---

## Part 2: Server-Side Tracking Setup

### Step 1: Get GA4 API Secret

1. Go to [Google Analytics](https://analytics.google.com/)
2. **Admin** → **Data Streams** → Select your stream
3. Scroll to **Measurement Protocol API secrets**
4. Click **Create** → Name it → Copy the **Secret value**

### Step 2: Get Meta Access Token

1. Go to [Meta Events Manager](https://business.facebook.com/events_manager2)
2. Select your Pixel → **Settings** → **Conversions API**
3. Click **Generate access token** → Copy the token

### Step 3: Get TikTok Pixel ID and Access Token

1. Go to [TikTok Ads Manager](https://ads.tiktok.com/)
2. **Assets** → **Events** → **Web Events**
3. Create or select your Pixel
4. Copy **Pixel ID** (numeric)
5. Go to **Settings** → **Events API** → **Generate access token** → Copy token

### Step 4: Get Google Ads Conversion ID and Label

1. Go to [Google Ads](https://ads.google.com/)
2. **Tools & Settings** → **Conversions**
3. Create or select a conversion action (e.g., "Booking Confirmation")
4. Under **Tag setup**, choose **Use Google Tag Manager**
5. Copy:
   - **Conversion ID**: Format `AW-XXXXXXXXXX`
   - **Conversion Label**: The label string
6. For server-side: Go to **Tag setup** → **Use Google Tag Manager** → **API secret** → Generate and copy

### Step 5: Add Environment Variables to Vercel

Add all these to Vercel Dashboard → **Settings** → **Environment Variables**:

```env
# GA4
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
GA4_API_SECRET=your_ga4_api_secret

# Meta Pixel
NEXT_PUBLIC_META_PIXEL_ID=1234567890
META_ACCESS_TOKEN=your_meta_access_token

# TikTok Pixel
NEXT_PUBLIC_TIKTOK_PIXEL_ID=CMXXXXXXXXXXXXXX
TIKTOK_ACCESS_TOKEN=your_tiktok_access_token

# Google Ads
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID=AW-XXXXXXXXXX
GOOGLE_ADS_CONVERSION_LABEL=your_conversion_label
GOOGLE_ADS_API_SECRET=your_google_ads_api_secret
```

**Important**: Select **Production**, **Preview**, and **Development** for all variables.

---

## Part 3: Event Mapping Reference

### Standard Event Mapping

| Application Event | GA4 Event | Meta Pixel Event | TikTok Event | Google Ads |
|-------------------|-----------|------------------|--------------|------------|
| `page_view` | `page_view` | `PageView` | `ViewContent` | N/A |
| `select_package` | `select_package` | `ViewContent` | `ViewContent` | N/A |
| `begin_checkout` | `begin_checkout` | `InitiateCheckout` | `InitiateCheckout` | N/A |
| `booking_created` | `booking_created` | `AddToCart` | `AddToCart` | N/A |
| `purchase` | `purchase` | `Purchase` | `CompletePayment` | Conversion |

### Event Parameters

All events include:
- `value`: Transaction value (number)
- `currency`: Currency code (e.g., `BDT`)
- `package_id`: Package identifier
- `booking_id` / `transaction_id`: Unique identifier

Enhanced Conversions (for Meta, TikTok, Google Ads):
- `email`: User email (hashed server-side)
- `phone`: User phone (hashed server-side)

---

## Part 4: Testing & Verification

### Test Client-Side Tracking (GTM Preview)

1. Open GTM → Click **Preview**
2. Enter your website URL
3. Navigate through the booking flow
4. In GTM Preview panel, verify:
   - ✅ All tags fire correctly
   - ✅ Data Layer variables populate
   - ✅ Events trigger appropriate tags

### Test Server-Side Tracking

1. **GA4**: Check **Reports** → **Realtime** → Should see events
2. **Meta**: Check **Events Manager** → **Test Events** → Should see events
3. **TikTok**: Check **Events Manager** → **Test Events** → Should see events
4. **Google Ads**: Check **Conversions** → Wait 24-48 hours for attribution

### Verify Network Requests

Open browser DevTools → **Network** tab:
- Filter `gtm.js` → Should see GTM container load
- Filter `google-analytics.com` → Should see GA4 requests
- Filter `facebook.net` → Should see Meta Pixel requests
- Filter `analytics.tiktok.com` → Should see TikTok Pixel requests
- Filter `/api/analytics/track` → Should see server-side requests (same domain)

---

## Part 5: Conversion Tracking Best Practices

### 1. Deduplication Strategy

**Problem**: Same event tracked client-side and server-side = duplicate conversions

**Solution**: 
- Use unique `event_id` for server-side events
- TikTok automatically deduplicates using `event_id`
- Meta uses event matching (email/phone + timestamp)
- Google Ads uses GCLID + conversion ID/Label

### 2. Enhanced Conversions

**Why**: Better attribution when cookies are blocked

**How**:
- Always send `email` and `phone` for conversion events
- Data is hashed (SHA-256) server-side for privacy
- Improves match rates by 20-30%

### 3. Conversion Value Tracking

**Critical**: Always include `value` and `currency` for:
- Purchase events
- Booking created events
- Package selection events (optional)

This enables:
- Revenue-based optimization
- ROAS (Return on Ad Spend) calculation
- Campaign performance analysis

### 4. Attribution Windows

**Default Attribution Windows:**
- **Meta**: 7-day click, 1-day view
- **TikTok**: 7-day click, 1-day view
- **Google Ads**: 30-day click, 1-day view (configurable)
- **GA4**: 30-day click, 1-day view (configurable)

**Best Practice**: Align attribution windows across platforms for consistent reporting.

### 5. Testing in Production

**Before Going Live:**
1. Test all events in GTM Preview mode
2. Verify server-side tracking in staging environment
3. Check Test Events in each platform's dashboard
4. Confirm no duplicate conversions (wait 24 hours)

---

## Part 6: Troubleshooting

### No Conversions Showing

**Check:**
- ✅ Environment variables set correctly in Vercel
- ✅ GTM container published (not just saved)
- ✅ Tags firing in GTM Preview
- ✅ Server-side API returning success (check Vercel logs)
- ✅ Attribution windows haven't expired
- ✅ Test Events showing in platform dashboards

### Duplicate Conversions

**Fix:**
- Ensure `event_id` is unique for server-side TikTok events
- Check if both client and server are sending same event
- Review deduplication settings in each platform

### Low Match Rates

**Improve:**
- Always send `email` and `phone` for conversion events
- Ensure data is hashed correctly (SHA-256)
- Verify Enhanced Conversions enabled in Google Ads
- Check user data quality (valid emails/phones)

### Server-Side Errors

**Debug:**
- Check Vercel function logs
- Verify API secrets/tokens are correct
- Test API endpoints directly with Postman/curl
- Check rate limits (TikTok: 1000 events/second)

---

## Part 7: Professional Optimization Tips

### 1. Conversion Value Optimization

Track actual revenue, not just conversion count:
- Use `booking.fee` for purchase events
- Include partial payments in `totalPaid`
- Track lifetime value if possible

### 2. Event Sequencing

Track full funnel:
1. `page_view` → Landing page visit
2. `select_package` → Interest shown
3. `begin_checkout` → Intent to book
4. `booking_created` → Booking initiated
5. `purchase` → Sale confirmed

This enables:
- Funnel analysis
- Drop-off identification
- Campaign optimization at each stage

### 3. Audience Building

Use conversion events to build:
- **Lookalike Audiences** (Meta, TikTok)
- **Similar Audiences** (Google Ads)
- **Custom Audiences** for retargeting

### 4. Campaign Optimization

Platforms optimize for:
- **Meta**: Purchase events (highest value)
- **TikTok**: CompletePayment events
- **Google Ads**: Conversions with value

Ensure these events fire correctly for best campaign performance.

---

## Quick Setup Checklist

- [ ] GTM container verified (`GTM-PZLZB6CX`)
- [ ] GA4 Configuration tag created in GTM
- [ ] Meta Pixel base tag created in GTM
- [ ] TikTok Pixel base tag created in GTM
- [ ] Google Ads Conversion tag created in GTM
- [ ] All event tags created for custom events
- [ ] GA4 API Secret obtained and added to Vercel
- [ ] Meta Access Token obtained and added to Vercel
- [ ] TikTok Pixel ID and Access Token obtained and added to Vercel
- [ ] Google Ads Conversion ID, Label, and API Secret obtained and added to Vercel
- [ ] GTM Preview mode tested
- [ ] Server-side tracking verified in Test Events
- [ ] GTM container published
- [ ] Production tracking verified (wait 24-48 hours for full attribution)

---

## Support & Resources

**Documentation:**
- [GA4 Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/ga4)
- [Meta Conversions API](https://developers.facebook.com/docs/marketing-api/conversions-api)
- [TikTok Events API](https://ads.tiktok.com/help/article?aid=10028)
- [Google Ads Conversion Tracking](https://support.google.com/google-ads/answer/1722054)

**Testing Tools:**
- GTM Preview & Debug
- Meta Events Manager Test Events
- TikTok Events Manager Test Events
- Google Ads Conversion Tracking Status

**Professional Tips:**
- Monitor conversion rates daily
- Set up alerts for tracking failures
- Review attribution reports weekly
- Optimize campaigns based on conversion data