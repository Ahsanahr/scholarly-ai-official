import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { adminDb } from '@/lib/firebase-admin';
import * as admin from 'firebase-admin';

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signatureHeader = request.headers.get('x-payment-signature'); // Usually provided by the gateway
    const secret = process.env.PAYMENT_GATEWAY_SECRET;

    if (!secret) {
      console.error('PAYMENT_GATEWAY_SECRET is missing');
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

    if (!signatureHeader) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    // Cryptographically verify the payload
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    // Prevent timing attacks using crypto.timingSafeEqual
    const signatureBuffer = Buffer.from(signatureHeader);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (signatureBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) {
      return NextResponse.json({ error: 'Invalid signature. Spoofing detected.' }, { status: 403 });
    }

    const payload = JSON.parse(rawBody);
    
    // Process the payment if status is PAID
    if (payload.status === 'PAID') {
      const { user_id, plan, period = 'monthly' } = payload;
      
      let baseCredits = 0;
      if (plan === 'pro') baseCredits = 450;
      else if (plan === 'premier') baseCredits = 1350;
      
      let multiplier = 1;
      if (period === 'quarterly') multiplier = 3;
      else if (period === 'yearly') multiplier = 12;

      const creditsToAdd = baseCredits * multiplier;

      if (creditsToAdd > 0) {
        const userRef = adminDb.collection('users').doc(user_id);
        
        // Securely update the user's plan and add credits
        await adminDb.runTransaction(async (transaction: any) => {
          const userDoc = await transaction.get(userRef);
          
          if (!userDoc.exists) {
            // Document might not exist if they never saved any user info, so initialize it
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
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
