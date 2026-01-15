# Deployment Guide for Vercel

This guide will help you deploy the drive-school application to Vercel.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. GitHub repository with your code
3. All environment variables ready

## Step 1: Push Code to GitHub

Make sure your code is pushed to a GitHub repository:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

## Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js

## Step 3: Configure Environment Variables

In the Vercel project settings, add the following environment variables:

### Firebase Configuration (Client-side)
- `NEXT_PUBLIC_FIREBASE_API_KEY` - Your Firebase API key
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` - Your Firebase auth domain
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` - `three-star-driving`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` - Your Firebase storage bucket
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` - Your messaging sender ID
- `NEXT_PUBLIC_FIREBASE_APP_ID` - Your Firebase app ID
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` - Your Firebase measurement ID

### Firebase Admin (Server-side)
- `FIREBASE_ADMIN_PROJECT_ID` - `three-star-driving`
- `FIREBASE_ADMIN_CLIENT_EMAIL` - From your service account JSON: `firebase-adminsdk-fbsvc@three-star-driving.iam.gserviceaccount.com`
- `FIREBASE_ADMIN_PRIVATE_KEY` - From your service account JSON (the entire private key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`)

**Important**: For `FIREBASE_ADMIN_PRIVATE_KEY`, copy the entire private key from the JSON file, including the BEGIN/END markers. In Vercel, you may need to replace newlines with `\n` or paste it as-is.

### MongoDB
- `MONGODB_URI` - Your MongoDB connection string

### Admin Access
- `ADMIN_FIREBASE_UIDS` - Comma-separated list of admin Firebase UIDs (e.g., `9Z73mxsFpDZvqdyZ7nNRc6vB7522`)

### Training Center Info
- `NEXT_PUBLIC_TRAINING_CENTER_NAME` - `থ্রি স্টার ড্রাইভিং ট্রেনিং সেন্টার`
- `NEXT_PUBLIC_TRAINING_CENTER_ADDRESS` - `বান্দ রোড, বরিশাল 8200`
- `NEXT_PUBLIC_TRAINING_CENTER_PHONE` - `+8801707969391`
- `NEXT_PUBLIC_TRAINING_CENTER_EMAIL` - Your email
- `NEXT_PUBLIC_TRAINING_CENTER_FACEBOOK_URL` - `https://www.facebook.com/profile.php?id=61557557160429`
- `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL` - Your Google Maps embed URL

### SMTP Configuration (for emails)
- `SMTP_HOST` - Your SMTP host
- `SMTP_PORT` - Your SMTP port (usually 587)
- `SMTP_USER` - Your SMTP username
- `SMTP_PASS` - Your SMTP password
- `SMTP_FROM_EMAIL` - Email address to send from

### App URL (for certificate links)
- `NEXT_PUBLIC_APP_URL` - Your Vercel deployment URL (e.g., `https://your-app.vercel.app`)

## Step 4: Getting Firebase Admin Private Key

To get the `FIREBASE_ADMIN_PRIVATE_KEY`:

1. Open your `three-star-driving-firebase-adminsdk-fbsvc-9d319171c1.json` file
2. Copy the entire value of the `private_key` field (including the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` lines)
3. In Vercel, paste it as-is. Vercel will handle the newlines automatically.

Alternatively, you can format it as a single line by replacing actual newlines with `\n`:
```
-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDV5Yg9CJdOdHdr...\n-----END PRIVATE KEY-----\n
```

## Step 5: Deploy

1. After setting all environment variables, click "Deploy"
2. Vercel will build and deploy your application
3. Once deployed, you'll get a URL like `https://your-app.vercel.app`

## Step 6: Update App URL

After deployment, update the `NEXT_PUBLIC_APP_URL` environment variable with your actual Vercel URL (for certificate links to work properly).

## Troubleshooting

### Build Fails
- Check that all required environment variables are set
- Verify MongoDB connection string is correct
- Check Firebase credentials are valid

### Firebase Admin Errors
- Ensure `FIREBASE_ADMIN_PRIVATE_KEY` includes the BEGIN/END markers
- Verify `FIREBASE_ADMIN_CLIENT_EMAIL` matches your service account
- Check that the service account has proper permissions in Firebase Console

### MongoDB Connection Issues
- Verify MongoDB URI is correct
- Check if MongoDB allows connections from Vercel's IPs (may need to whitelist)
- Ensure MongoDB Atlas network access is configured

## Quick Deploy with Vercel CLI

Alternatively, you can use Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# For production deployment
vercel --prod
```

## Environment Variables Template

Create a `.env.production` file locally (don't commit it) to keep track:

```env
# Firebase Client
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=three-star-driving
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# Firebase Admin
FIREBASE_ADMIN_PROJECT_ID=three-star-driving
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=

# MongoDB
MONGODB_URI=

# Admin
ADMIN_FIREBASE_UIDS=9Z73mxsFpDZvqdyZ7nNRc6vB7522

# Training Center
NEXT_PUBLIC_TRAINING_CENTER_NAME=থ্রি স্টার ড্রাইভিং ট্রেনিং সেন্টার
NEXT_PUBLIC_TRAINING_CENTER_ADDRESS=বান্দ রোড, বরিশাল 8200
NEXT_PUBLIC_TRAINING_CENTER_PHONE=+8801707969391
NEXT_PUBLIC_TRAINING_CENTER_EMAIL=
NEXT_PUBLIC_TRAINING_CENTER_FACEBOOK_URL=https://www.facebook.com/profile.php?id=61557557160429

# SMTP
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM_EMAIL=

# App URL (update after deployment)
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```
