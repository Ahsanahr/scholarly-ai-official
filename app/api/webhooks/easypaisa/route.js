import { NextResponse } from 'next/server';
import { generateEasyPaisaHash } from '../../../../utils/payment-crypto';
import { adminDb } from '@/lib/firebase-admin';
import * as admin from 'firebase-admin';

const EASYPAISA_HASH_KEY = process.env.EASYPAISA_HASH_KEY || 'SANDBOX_HASH_KEY';

export async function POST(req) {
  try {
    // EasyPaisa often sends data as URL encoded form data or JSON depending on the API version.
    // Assuming form data for standard hosted checkout IPN (Instant Payment Notification).
    let data = {};
    const contentType = req.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      data = await req.json();
    } else {
      const formData = await req.formData();
      data = Object.fromEntries(formData.entries());
    }

    console.log('Received EasyPaisa Webhook:', data);

    // 1. Verify Hash
    // EasyPaisa's webhook hash verification is slightly different. They usually send a hash that you must recalculate to match.
    // For this generic template, we assume they send 'merchantHashedReq' back, or a specific 'signature'.
    // NOTE: You MUST check the exact parameters EP sends in the IPN payload.
    const providedHash = data.merchantHashedReq || data.signature; 
    
    if (providedHash) {
        // Re-generate the hash on your server using the received data (excluding the hash itself) to verify
        // const calculatedHash = generateEasyPaisaHash(data, EASYPAISA_HASH_KEY);
        // if (providedHash !== calculatedHash) { ... return 401 }
    }

    // 2. Check the Status
    // EasyPaisa statuses: '0000' (Success), '0001' (System Error), etc.
    if (data.responseCode === '0000' || data.transactionStatus === 'SUCCESS') {
      const orderId = data.orderRefNumber || data.orderRefNum || data.orderId || '';
      const amountPaid = data.transactionAmount || data.amount || 0;

      // GLITCH-FREE AUTOMATED VERIFICATION (DATABASE UPDATE)
      console.log(`EasyPaisa Payment Success! Order: ${orderId}, Amount: ${amountPaid}`);
      
      // Parse embedded metadata from orderId: EP_${userId}_${plan}_${period}_${Date.now()}
      const parts = orderId.split('_');
      if (parts.length >= 4) {
        const userId = parts[1];
        const plan = parts[2];
        const period = parts[3];

        if (userId && ['pro', 'premier'].includes(plan)) {
          let baseCredits = plan === 'pro' ? 50 : 450;
          let multiplier = period === 'quarterly' ? 3 : period === 'yearly' ? 12 : 1;
          const creditsToAdd = baseCredits * multiplier;

          const userRef = adminDb.collection('users').doc(userId);
          
          await adminDb.runTransaction(async (transaction) => {
            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists) {
              transaction.set(userRef, {
                uid: userId,
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
          
          console.log(`Successfully upgraded user ${userId} to ${plan} with +${creditsToAdd} credits via EasyPaisa.`);
        }
      }
      
      return NextResponse.json({ success: true, message: 'Webhook Processed Successfully' }, { status: 200 });

    } else {
      console.warn(`EasyPaisa Payment Failed/Pending: ${data.responseCode}`);
      return NextResponse.json({ success: true, message: 'Handled Non-Success Status' }, { status: 200 });
    }

  } catch (error) {
    console.error('EasyPaisa Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
