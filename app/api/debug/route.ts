import { NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';

export async function GET() {
  return NextResponse.json({
    adminDbCollectionIsFunction: typeof adminDb.collection === 'function',
    adminAuthVerifyIdTokenIsFunction: typeof adminAuth.verifyIdToken === 'function',
    hasEnvKey: !!process.env.FIREBASE_SERVICE_ACCOUNT_KEY,
    projectEnv: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  });
}
