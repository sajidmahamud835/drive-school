# Drive School Landing Page

A Next.js-based landing page and booking system for a driving training center.

## Features

- Landing page with packages, testimonials, and reviews
- Booking system with time slot selection
- Firebase Authentication (Email/Password, Google OAuth)
- Admin dashboard for confirming bookings
- Email notifications
- **Professional Multi-Platform Conversion Tracking**:
  - Google Analytics 4 (GA4)
  - Meta Pixel (Facebook/Instagram Ads)
  - TikTok Pixel (TikTok Ads)
  - Google Ads Conversion Tracking
  - Dual tracking: Client-side (GTM) + Server-side (same domain)

## Tech Stack

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Firebase Auth
- MongoDB
- Nodemailer

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.local.example`)
4. Run development server: `npm run dev`

## Environment Variables

See `.env.local.example` for required variables.

## Conversion Tracking Setup

**Professional multi-platform conversion tracking is built-in!**

1. **Quick Start**: See `QUICK_START_ANALYTICS.md` (30-minute setup)
2. **Complete Guide**: See `CONVERSION_TRACKING_SETUP.md` (detailed instructions)
3. **GTM Templates**: See `GTM_TAG_TEMPLATES.md` (copy-paste ready code)

**Platforms Supported:**
- Google Analytics 4 (GA4)
- Meta Pixel (Facebook/Instagram Ads)
- TikTok Pixel (TikTok Ads)
- Google Ads (Conversion Tracking)

**Features:**
- Dual tracking (client-side GTM + server-side same-domain)
- Enhanced Conversions (email/phone hashing)
- Automatic event mapping
- Deduplication support

## Deployment

### Deploy to Vercel

1. **Quick Deploy**: See `deploy-vercel.md` for step-by-step instructions
2. **Detailed Guide**: See `DEPLOYMENT.md` for comprehensive deployment guide

### Quick Steps:
1. Push code to GitHub
2. Import project in Vercel dashboard
3. Add all environment variables (see `deploy-vercel.md`)
4. Set up conversion tracking (see `QUICK_START_ANALYTICS.md`)
5. Deploy!

The app is configured to:
- Use JSON file for Firebase Admin in development
- Use environment variables for Firebase Admin in production (Vercel)
- Automatically detect Vercel environment
- Support dual-layer conversion tracking for maximum reliability
