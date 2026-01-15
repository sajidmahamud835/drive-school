# Drive School Landing Page

A Next.js-based landing page and booking system for a driving training center.

## Features

- Landing page with packages, testimonials, and reviews
- Booking system with time slot selection
- Firebase Authentication (Email/Password, Google OAuth)
- Admin dashboard for confirming bookings
- Email notifications
- Google Calendar integration
- Analytics tracking (GA4, Meta Pixel)

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

## Deployment

### Deploy to Vercel

1. **Quick Deploy**: See `deploy-vercel.md` for step-by-step instructions
2. **Detailed Guide**: See `DEPLOYMENT.md` for comprehensive deployment guide

### Quick Steps:
1. Push code to GitHub
2. Import project in Vercel dashboard
3. Add all environment variables (see `deploy-vercel.md`)
4. Deploy!

The app is configured to:
- Use JSON file for Firebase Admin in development
- Use environment variables for Firebase Admin in production (Vercel)
- Automatically detect Vercel environment
