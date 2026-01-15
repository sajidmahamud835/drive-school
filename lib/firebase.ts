import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getAnalytics, Analytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyBnKn0_OpdV_A9VIGf5_xrqsw1MydJWNsA',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'three-star-driving.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'three-star-driving',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'three-star-driving.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '231310407318',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:231310407318:web:8fea5d80def4fd7e5e74b7',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-LC5R3Z7EBC',
};

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let analytics: Analytics | null = null;

if (typeof window !== 'undefined') {
  // Client-side initialization
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    // Initialize Analytics only in browser and if supported
    isSupported().then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    }).catch(() => {
      // Analytics not supported, continue without it
      analytics = null;
    });
  } else {
    app = getApps()[0];
  }
  auth = getAuth(app);
} else {
  // Server-side: return null (we'll use Firebase Admin on server)
  auth = null as any;
}

export { auth, analytics };
export default app;
