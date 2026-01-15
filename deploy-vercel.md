# Quick Vercel Deployment Guide

## Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Click "Add New..." → "Project"
   - Import your GitHub repository

3. **Configure Environment Variables**
   - In the project settings, go to "Environment Variables"
   - Add all variables from the list below

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

## Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (follow prompts)
vercel

# For production
vercel --prod
```

## Quick Helper: Extract Firebase Admin Credentials

Run this command to easily extract Firebase Admin credentials from your JSON file:

```bash
node scripts/extract-firebase-key.js
```

This will display the values you need to copy to Vercel.

## Required Environment Variables

Copy these to Vercel Dashboard → Settings → Environment Variables:

### Firebase Client (NEXT_PUBLIC_*)
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBnKn0_OpdV_A9VIGf5_xrqsw1MydJWNsA
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=three-star-driving.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=three-star-driving
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=three-star-driving.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=231310407318
NEXT_PUBLIC_FIREBASE_APP_ID=1:231310407318:web:8fea5d80def4fd7e5e74b7
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-LC5R3Z7EBC
```

### Firebase Admin (Server-side)
```
FIREBASE_ADMIN_PROJECT_ID=three-star-driving
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-fbsvc@three-star-driving.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDV5Yg9CJdOdHdr\nC+Nwym9zYZFief8youUM3S8jJtaB11qwom2NwUUJb+NXhmdoZQ69Bql70VaSthIW\ndg3jXnSLGMio9M29Xn8vIHaKilXnBP+xFBjUG2va+DBpBc08FUvdGMBxyazst1I6\nNRCwA+CL1MOJJPvv/kX/odjhdj/KX/XWYwIyiRObdEa4HNfAh3LPHjP00QmC3xnU\n3lqll5HBQEmbaE3bVWVIby7KKbCSCqCWGAE2Z/gZTr1B1urVRB/pqOLzwl0zEu9R\nYMpA8OhYmZ3ww4ZkFOpfQNXhBytqLLcPPV+Sy6TN44FUWntVTO7GCbK/MZHnYIQ/\nZHknhdltAgMBAAECggEAVnffXvkBnbw0aGhabgbQDj9DlCFIWrKCUPR7cUTqk3u5\nFE3dZuBaJcn/CCtz0z6DOkQesMi8LDwBTOY1kBRnnbGLsM2h/Gtek/EWKsRonKcn\nLHE45kodjFwnydUIFkFvtTYj2fwS9XDYg2JfWCCBHlYJJAB4/ph2uLQ3ZlG00PzD\nffl85iu2shvaKA0oF6B4gOoyGRiBweIVjgPccSOTVAN9hj/APjmg/5+YvXj+vrsf\nIwS1KMk407D01L79siUgjPBE0/jAa2F49zZUmJF2WS6SaP6ek3w/H2Im2fKE62hw\n1bRBL8EnzrJomXLsF0Gx1aqEUVYj2hz409twc0EXKwKBgQD3D85Tnus4GnAq3uVo\nJRHa6IhDwTYpMAANL5jbIBN3hHaY+pl840Q9JEX7X6nZajE2EkyDoJ48WEHt4plf\n4O91owG2WETAvb5S+Os+i0MhBPAPG1csiCbMMLoDoFdjTcvlpLmMgKWZQuSqJ2Kp\nwtpY86VRN86f37WRh7cPwNhHOwKBgQDdopAmvbOehipz7OWDiLBYsCnF+3LsFtQY\n5t4rgj/2C3YWZhM1k+i3TpHftjgfFnoZY87QFfD8u2n2qyDl7ExAd+B2TEoIUAiJ\nkuk9Wv5NzoPpNqs5z8Q236bdk5MvoiaPGWesUrxm1A7pYbPIaPjqdsprdDOXYF5g\nUaBknbxndwKBgBEGQc15UfQXvkr1+RDoHQbcpyckFTtZV2eRNBNFbpH5ysJX4mO8\ntWMRMNFVkjqtGp8DO8qGMuEto71ks/TrZxTQGroZ8wLlEExfYrZ4mjOYR4KC+8rR\nxvqjEO5XCi6JmddFNpP7+W1KMr+W3zGbf7hJccba9Z4GqFhS5cZsH3spAoGBAJGF\nKQymxYayJLGUu2VPnCm/EM5zOJOWsY/gFcOPc5uDDvfJ8ZbeFJA2wESYieSvh1+g\nTqwFnAL0srBI0ALm0XIKw5AoqvsmQVTC5u1oD0za6XV4dZgxuG0nD5KwUJWX66VN\nUuqsMBN77IaDpd1SPw0DDgjbdPxRQ+YN8jfd8VQlAoGAQ5M14GtqwHGRZj6a8gG5\nc2f67XvY2g+G9Ho357rkh7mf0MpGDHIG1mcb7GSoxLYvJKEZEY218LFXXDE0lpen\nGpZyVLJjHnJ9ysUkeywXqIv5qSP9ceI+wfUEi9l5MLYL/ODYuPchrs7HdV5t5TBe\nz81kERNV6vLZTsw8NpzVx5o=\n-----END PRIVATE KEY-----\n
```

**Note**: For `FIREBASE_ADMIN_PRIVATE_KEY`, copy the entire private key from your JSON file. In Vercel, you can paste it as-is (with actual newlines) or replace newlines with `\n`.

### MongoDB
```
MONGODB_URI=mongodb://tstar4345:PF2vZ6FJocC95G23NhgF-eTibdTbSX8adwOSqpQv5cO49f1w@8ef97fd1-9fb3-4ac5-997c-e3ff1bc5d1dd.asia-south1.firestore.goog:443/default?loadBalanced=true&tls=true&authMechanism=SCRAM-SHA-256&retryWrites=false
```

### Admin Access
```
ADMIN_FIREBASE_UIDS=9Z73mxsFpDZvqdyZ7nNRc6vB7522
```

### Training Center Info
```
NEXT_PUBLIC_TRAINING_CENTER_NAME=থ্রি স্টার ড্রাইভিং ট্রেনিং সেন্টার
NEXT_PUBLIC_TRAINING_CENTER_ADDRESS=বান্দ রোড, বরিশাল 8200
NEXT_PUBLIC_TRAINING_CENTER_PHONE=+8801707969391
NEXT_PUBLIC_TRAINING_CENTER_EMAIL=info@threestardriving.com
NEXT_PUBLIC_TRAINING_CENTER_FACEBOOK_URL=https://www.facebook.com/profile.php?id=61557557160429
NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL=https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3681.059527485678!2d90.36485357429086!3d22.688827828702358!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x37553592540275d5%3A0x8ff9f400f2f49933!2zMyDgprjgp43gpp_gpr7gprAg4Kah4KeN4Kaw4Ka-4KaH4Kat4Ka_4KaCIOCmn-CnjeCmsOCnh-CmqOCmv-CmgiDgprjgp4fgpqjgp43gpp_gp4fgprA!5e0!3m2!1sbn!2sbd!4v1768451664109!5m2!1sbn!2sbd
```

### SMTP (Optional - for email notifications)
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM_EMAIL=your-email@gmail.com
```

### App URL (Update after deployment)
```
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```
**Important**: After your first deployment, update this with your actual Vercel URL.

## After Deployment

1. **Update NEXT_PUBLIC_APP_URL** with your actual Vercel deployment URL
2. **Redeploy** to apply the change
3. **Test** all features:
   - User registration/login
   - Booking creation
   - Admin dashboard access
   - Certificate generation

## Troubleshooting

- **Build fails**: Check all environment variables are set correctly
- **Firebase Admin errors**: Verify private key includes BEGIN/END markers
- **MongoDB connection**: Ensure MongoDB allows connections from Vercel IPs
