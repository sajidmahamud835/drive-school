# Quick Start: Multi-Platform Conversion Tracking

This is a quick reference guide to get your conversion tracking up and running in 30 minutes.

## What You're Setting Up

**4 Platforms** with **dual tracking** (client + server-side):
- ✅ Google Analytics 4 (GA4)
- ✅ Meta Pixel (Facebook/Instagram Ads)
- ✅ TikTok Pixel (TikTok Ads)
- ✅ Google Ads (Conversion Tracking)

## Prerequisites Checklist

Before starting, ensure you have:
- [ ] Google Tag Manager account (Container: `GTM-PZLZB6CX`)
- [ ] Google Analytics 4 property
- [ ] Meta Business account with Events Manager access
- [ ] TikTok Ads Manager account
- [ ] Google Ads account
- [ ] Vercel project access

---

## 30-Minute Setup Guide

### Step 1: Get Your Credentials (10 minutes)

#### GA4
1. Go to [Google Analytics](https://analytics.google.com/)
2. Admin → Data Streams → Your web stream
3. Copy **Measurement ID**: `G-XXXXXXXXXX`
4. Scroll to **Measurement Protocol API secrets** → Create → Copy **Secret**

#### Meta Pixel
1. Go to [Meta Events Manager](https://business.facebook.com/events_manager2)
2. Create Pixel → Copy **Pixel ID**: `1234567890`
3. Settings → Conversions API → Generate access token → Copy **Token**

#### TikTok Pixel
1. Go to [TikTok Ads Manager](https://ads.tiktok.com/)
2. Assets → Events → Web Events → Create Pixel
3. Copy **Pixel ID**: `CMXXXXXXXXXXXXXX`
4. Settings → Events API → Generate access token → Copy **Token**

#### Google Ads
1. Go to [Google Ads](https://ads.google.com/)
2. Tools & Settings → Conversions → Create conversion action
3. Copy **Conversion ID**: `AW-XXXXXXXXXX`
4. Copy **Conversion Label**: `abc123`
5. Tag setup → API secret → Generate → Copy **Secret**

---

### Step 2: Add to Vercel (5 minutes)

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add all 10 variables:

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
GA4_API_SECRET=your_secret
NEXT_PUBLIC_META_PIXEL_ID=1234567890
META_ACCESS_TOKEN=your_token
NEXT_PUBLIC_TIKTOK_PIXEL_ID=CMXXXXXXXXXXXXXX
TIKTOK_ACCESS_TOKEN=your_token
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID=AW-XXXXXXXXXX
GOOGLE_ADS_CONVERSION_LABEL=your_label
GOOGLE_ADS_API_SECRET=your_secret
```

3. Select **Production**, **Preview**, **Development** for each
4. Click **Save**

---

### Step 3: Set Up GTM Tags (15 minutes)

Open `GTM_TAG_TEMPLATES.md` and follow these steps:

1. **GA4 Configuration Tag** (2 min)
   - Copy template from `GTM_TAG_TEMPLATES.md`
   - Replace `YOUR_MEASUREMENT_ID`
   - Trigger: All Pages

2. **Meta Pixel Base Tag** (2 min)
   - Copy template
   - Replace `YOUR_PIXEL_ID`
   - Trigger: All Pages

3. **TikTok Pixel Base Tag** (2 min)
   - Copy template
   - Replace `YOUR_PIXEL_ID`
   - Trigger: All Pages

4. **Google Ads Conversion Tag** (2 min)
   - Use GTM native tag or Custom HTML
   - Replace `AW-XXXXXXXXXX` and label
   - Trigger: Custom Event `purchase`

5. **Event Tags** (7 min)
   - Create event tags for `select_package`, `booking_created`, `purchase`
   - Use templates from `GTM_TAG_TEMPLATES.md`
   - Set appropriate triggers

---

### Step 4: Test & Publish (5 minutes)

1. **Test in GTM Preview**:
   - Click Preview in GTM
   - Enter your website URL
   - Navigate through booking flow
   - Verify all tags fire

2. **Test Server-Side**:
   - Check Vercel function logs
   - Verify events in platform Test Events dashboards

3. **Publish GTM Container**:
   - Click **Submit** in GTM
   - Add version name: "Initial conversion tracking setup"
   - Click **Publish**

---

## Verification Checklist

After setup, verify:

- [ ] GTM container loads on website (check Network tab)
- [ ] GA4 events appear in Realtime reports
- [ ] Meta events appear in Test Events
- [ ] TikTok events appear in Test Events
- [ ] Google Ads conversion status shows "Recording conversions"
- [ ] Server-side API returns success (check Vercel logs)

---

## Event Flow Diagram

```
User Action
    ↓
Application Code
    ↓
    ├─→ dataLayer.push() ──→ GTM ──→ Client-Side Tags ──→ Platforms
    │
    └─→ /api/analytics/track ──→ Server-Side API ──→ Platforms
```

**Both paths run simultaneously** for maximum reliability!

---

## Troubleshooting Quick Fixes

| Issue | Quick Fix |
|-------|-----------|
| No events in GA4 | Check Measurement ID in GTM tag |
| Meta Pixel not firing | Verify Pixel ID in base code |
| TikTok events missing | Check Pixel ID format (CM... or numeric) |
| Google Ads not recording | Wait 24-48 hours, check conversion status |
| Server-side errors | Verify API secrets/tokens in Vercel |

---

## Next Steps

1. **Monitor Daily**: Check conversion rates in each platform
2. **Optimize Campaigns**: Use conversion data to optimize ad spend
3. **Build Audiences**: Create lookalike audiences from converters
4. **A/B Test**: Test different landing pages based on conversion data

---

## Full Documentation

- **Complete Setup Guide**: `CONVERSION_TRACKING_SETUP.md`
- **GTM Tag Templates**: `GTM_TAG_TEMPLATES.md`
- **Analytics Setup**: `ANALYTICS_SETUP.md`

---

## Support

If you encounter issues:
1. Check browser console for errors
2. Check Vercel function logs
3. Use GTM Preview mode to debug
4. Verify Test Events in each platform
5. Review troubleshooting section in `CONVERSION_TRACKING_SETUP.md`