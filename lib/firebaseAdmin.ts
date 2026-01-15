import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import * as path from 'path';
import * as fs from 'fs';

let app: App;
let adminAuth: Auth;

if (getApps().length === 0) {
  let serviceAccount: any = undefined;

  // In production (Vercel), prioritize environment variables
  // In development, try JSON file first, then fall back to env vars
  const isProduction = process.env.VERCEL || process.env.NODE_ENV === 'production';

  if (isProduction) {
    // Production: Use environment variables (required for Vercel)
    if (process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
      serviceAccount = {
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
      };
      console.log('[Firebase Admin] Loaded credentials from environment variables (production)');
    }
  } else {
    // Development: Try JSON file first, then environment variables
    try {
      const serviceAccountPath = path.join(process.cwd(), 'three-star-driving-firebase-adminsdk-fbsvc-9d319171c1.json');
      if (fs.existsSync(serviceAccountPath)) {
        const serviceAccountFile = fs.readFileSync(serviceAccountPath, 'utf8');
        serviceAccount = JSON.parse(serviceAccountFile);
        console.log('[Firebase Admin] Loaded credentials from JSON file (development)');
      }
    } catch (error) {
      console.warn('[Firebase Admin] Could not load JSON file, trying environment variables:', error);
    }

    // Fallback to environment variables in development
    if (!serviceAccount && process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
      serviceAccount = {
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
      };
      console.log('[Firebase Admin] Loaded credentials from environment variables (development)');
    }
  }

  // Initialize with service account if available
  if (serviceAccount && serviceAccount.project_id && serviceAccount.client_email && serviceAccount.private_key) {
    app = initializeApp({
      credential: cert({
        projectId: serviceAccount.project_id,
        clientEmail: serviceAccount.client_email,
        privateKey: serviceAccount.private_key.replace(/\\n/g, '\n'),
      }),
      projectId: serviceAccount.project_id,
    });
    console.log('[Firebase Admin] Initialized with service account credentials');
  } else if (serviceAccount && serviceAccount.projectId && serviceAccount.clientEmail && serviceAccount.privateKey) {
    // Handle case where keys are camelCase (from env vars)
    app = initializeApp({
      credential: cert({
        projectId: serviceAccount.projectId,
        clientEmail: serviceAccount.clientEmail,
        privateKey: serviceAccount.privateKey.replace(/\\n/g, '\n'),
      }),
      projectId: serviceAccount.projectId,
    });
    console.log('[Firebase Admin] Initialized with service account credentials (camelCase)');
  } else {
    // Fallback to default credentials (for local development with gcloud CLI)
    try {
      app = initializeApp({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'three-star-driving',
      });
      console.log('[Firebase Admin] Initialized with default credentials');
    } catch (error) {
      console.error('[Firebase Admin] Initialization error:', error);
      throw new Error('Firebase Admin SDK initialization failed. Check environment variables or service account JSON file.');
    }
  }
} else {
  app = getApps()[0];
  console.log('[Firebase Admin] Using existing app instance');
}

adminAuth = getAuth(app);

export { adminAuth };
export default app;
