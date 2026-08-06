import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    let credential;

    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      try {
        let serviceAccount;
        const rawKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY.trim();
        if (rawKey.startsWith('{')) {
          serviceAccount = JSON.parse(rawKey);
        } else {
          serviceAccount = JSON.parse(
            Buffer.from(rawKey, 'base64').toString('utf8')
          );
        }
        credential = admin.credential.cert(serviceAccount);
      } catch (e) {
        console.warn('Failed parsing FIREBASE_SERVICE_ACCOUNT_KEY:', e);
      }
    }

    if (!credential) {
      if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
        try {
          credential = admin.credential.cert({
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "trazo-scholarly",
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          });
        } catch (e) {
          console.warn('Failed initializing explicit cert:', e);
        }
      }
    }

    if (!credential) {
      // Use applicationDefault or uninitialized app for build time without throwing ASN.1 key errors
      admin.initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "trazo-scholarly"
      });
      console.log('Firebase Admin initialized with default project config.');
    } else {
      admin.initializeApp({
        credential,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "trazo-scholarly"
      });
      console.log('Firebase Admin initialized with service account.');
    }
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
  }
}

export const adminAuth = admin.apps.length ? admin.auth() : {} as any;
export const adminDb = admin.apps.length ? admin.firestore() : {} as any;
