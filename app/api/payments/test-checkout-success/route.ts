import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import * as admin from 'firebase-admin';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { plan, period = 'monthly' } = body;

    if (!['pro', 'premier'].includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 });
    }

    let baseCredits = 0;
    if (plan === 'pro') baseCredits = 450;
    else if (plan === 'premier') baseCredits = 1350;

    let multiplier = 1;
    if (period === 'quarterly') multiplier = 3;
    else if (period === 'yearly') multiplier = 12;

    const creditsToAdd = baseCredits * multiplier;

    const user_id = decodedToken.uid;
    const userRef = adminDb.collection('users').doc(user_id);

    await adminDb.runTransaction(async (transaction: any) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists) {
        transaction.set(userRef, {
          uid: user_id,
          plan,
          credits: creditsToAdd,
          plan_updated_at: admin.firestore.FieldValue.serverTimestamp()
        });
      } else {
        const currentCredits = userDoc.data()?.credits || 0;
        transaction.update(userRef, {
          plan,
          credits: currentCredits + creditsToAdd,
          plan_updated_at: admin.firestore.FieldValue.serverTimestamp()
        });
      }
    });

    return NextResponse.json({ success: true, newPlan: plan });
  } catch (error: any) {
    console.error('Test Checkout Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
