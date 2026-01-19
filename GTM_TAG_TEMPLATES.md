# GTM Tag Templates - Quick Copy & Paste

This document provides ready-to-use GTM tag templates for quick setup.

## Meta Pixel Tags

### Base Code (All Pages)
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

### ViewContent (Package Selection)
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
**Trigger**: Custom Event `select_package`

### AddToCart (Booking Created)
```html
<script>
fbq('track', 'AddToCart', {
  content_ids: ['{{package_id}}'],
  content_type: 'product',
  value: {{value}},
  currency: 'BDT',
  user_data: {
    em: ['{{email}}'],
    ph: ['{{phone}}']
  }
});
</script>
```
**Trigger**: Custom Event `booking_created`

**Note**: `{{email}}` and `{{phone}}` are optional but recommended for Enhanced Conversions. These should be Data Layer Variables.

### Purchase (Booking Confirmed)
```html
<script>
fbq('track', 'Purchase', {
  content_ids: ['{{package_id}}'],
  content_type: 'product',
  value: {{value}},
  currency: 'BDT',
  user_data: {
    em: ['{{email}}'],
    ph: ['{{phone}}']
  }
});
</script>
```
**Trigger**: Custom Event `purchase`

**Note**: `{{email}}` and `{{phone}}` are optional but recommended for Enhanced Conversions. These should be Data Layer Variables.

---

## TikTok Pixel Tags

### Base Code (All Pages)
```html
<script>
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
  ttq.load('YOUR_PIXEL_ID');
  ttq.page();
}(window, document, 'ttq');
</script>
```

### ViewContent (Package Selection)
```html
<script>
ttq.track('ViewContent', {
  content_name: '{{package_name}}',
  content_id: '{{package_id}}',
  value: {{value}},
  currency: 'BDT'
});
</script>
```
**Trigger**: Custom Event `select_package`

### AddToCart (Booking Created)
```html
<script>
ttq.track('AddToCart', {
  content_id: '{{package_id}}',
  value: {{value}},
  currency: 'BDT',
  email: '{{email}}',
  phone_number: '{{phone}}'
});
</script>
```
**Trigger**: Custom Event `booking_created`

**Note**: `{{email}}` and `{{phone}}` are optional but recommended for Enhanced Conversions. These should be Data Layer Variables.

### CompletePayment (Booking Confirmed)
```html
<script>
ttq.track('CompletePayment', {
  content_id: '{{package_id}}',
  value: {{value}},
  currency: 'BDT',
  order_id: '{{transaction_id}}',
  email: '{{email}}',
  phone_number: '{{phone}}'
});
</script>
```
**Trigger**: Custom Event `purchase`

**Note**: `{{email}}` and `{{phone}}` are optional but recommended for Enhanced Conversions. These should be Data Layer Variables.

---

## Google Ads Conversion Tag

### Using GTM Native Tag
1. Tag Type: **Google Ads Conversion Tracking**
2. Conversion ID: `AW-XXXXXXXXXX`
3. Conversion Label: `your_conversion_label`
4. Conversion Value: `{{value}}`
5. Currency Code: `BDT`
6. Trigger: Custom Event `purchase`

### Using Custom HTML (Alternative)
```html
<script>
gtag('event', 'conversion', {
  'send_to': 'AW-XXXXXXXXXX/your_conversion_label',
  'value': {{value}},
  'currency': 'BDT',
  'transaction_id': '{{transaction_id}}'
});
</script>
```
**Trigger**: Custom Event `purchase`

**For Enhanced Conversions**, add user data:
```html
<script>
gtag('event', 'conversion', {
  'send_to': 'AW-XXXXXXXXXX/your_conversion_label',
  'value': {{value}},
  'currency': 'BDT',
  'transaction_id': '{{transaction_id}}',
  'user_data': {
    'email_address': '{{email}}',
    'phone_number': '{{phone}}'
  }
});
</script>
```

---

## GA4 Event Tags

### Select Package Event
1. Tag Type: **Google Analytics: GA4 Event**
2. Configuration Tag: Select your GA4 Configuration tag
3. Event Name: `select_package`
4. Event Parameters:
   - `package_id`: `{{package_id}}`
   - `package_name`: `{{package_name}}`
   - `value`: `{{value}}`
   - `currency`: `BDT`
5. Trigger: Custom Event `select_package`

### Booking Created Event
1. Tag Type: **Google Analytics: GA4 Event**
2. Configuration Tag: Select your GA4 Configuration tag
3. Event Name: `booking_created`
4. Event Parameters:
   - `booking_id`: `{{booking_id}}`
   - `package_id`: `{{package_id}}`
   - `value`: `{{value}}`
   - `currency`: `BDT`
5. Trigger: Custom Event `booking_created`

### Purchase Event
1. Tag Type: **Google Analytics: GA4 Event**
2. Configuration Tag: Select your GA4 Configuration tag
3. Event Name: `purchase`
4. Event Parameters:
   - `transaction_id`: `{{transaction_id}}`
   - `package_id`: `{{package_id}}`
   - `value`: `{{value}}`
   - `currency`: `BDT`
5. Trigger: Custom Event `purchase`

---

## Custom Event Triggers

Create these triggers in GTM:

1. **select_package**:
   - Trigger Type: **Custom Event**
   - Event name: `select_package`

2. **booking_created**:
   - Trigger Type: **Custom Event**
   - Event name: `booking_created`

3. **purchase**:
   - Trigger Type: **Custom Event**
   - Event name: `purchase`

4. **begin_checkout**:
   - Trigger Type: **Custom Event**
   - Event name: `begin_checkout`

---

## Data Layer Variable Setup

In GTM, go to **Variables** → **New** → **Data Layer Variable**:

1. `package_id` - Variable Name: `package_id`
2. `package_name` - Variable Name: `package_name`
3. `value` - Variable Name: `value`
4. `currency` - Variable Name: `currency`
5. `booking_id` - Variable Name: `booking_id`
6. `transaction_id` - Variable Name: `transaction_id`
7. `email` - Variable Name: `email` (optional, for Enhanced Conversions)
8. `phone` - Variable Name: `phone` (optional, for Enhanced Conversions)

---

## Testing Checklist

After setting up all tags:

1. ✅ Open GTM Preview mode
2. ✅ Navigate to your website
3. ✅ Click on a package → Verify `select_package` event fires
4. ✅ Create a booking → Verify `booking_created` event fires
5. ✅ Confirm booking (admin) → Verify `purchase` event fires
6. ✅ Check each platform's Test Events dashboard
7. ✅ Verify server-side tracking in Vercel logs
8. ✅ Publish GTM container

---

## Quick Reference: Event Flow

```
User Action → dataLayer.push() → GTM Tags Fire → Platforms Receive Events
                ↓
         /api/analytics/track → Server-Side APIs → Platforms Receive Events
```

Both paths run in parallel for maximum reliability!