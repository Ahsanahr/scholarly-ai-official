import { NextResponse } from 'next/server';
import { verifyJazzCashWebhook } from '../../../../utils/payment-crypto';
import { adminDb } from '@/lib/firebase-admin';
import * as admin from 'firebase-admin';

const JAZZCASH_INTEGRITY_SALT = process.env.JAZZCASH_INTEGRITY_SALT || 'SANDBOX_SALT';

export async function POST(req) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  try {
    // JazzCash sends Webhooks as Form Data (application/x-www-form-urlencoded) via user browser POST redirection
    const formData = await req.formData();
    const data = Object.fromEntries(formData.entries());

    console.log('Received JazzCash Webhook:', data);

    // 1. Verify the Cryptographic Hash to ensure this request actually came from JazzCash and wasn't tampered with
    const isValid = verifyJazzCashWebhook(data, JAZZCASH_INTEGRITY_SALT);

    if (!isValid) {
      console.error('JazzCash Webhook Verification Failed: Invalid Hash');
      return NextResponse.redirect(`${baseUrl}/payment-status?responseCode=failed&error=signature_mismatch`, 303);
    }

    // 2. Check the Response Code
    // '000' means the transaction was perfectly successful
    if (data.pp_ResponseCode === '000') {
      const orderId = data.pp_TxnRefNo;
      const amountPaidStr = data.pp_Amount; // in paisas (e.g., 10000 = 100 PKR)
      const userId = data.ppmpf_1; // User ID passed in checkout
      const plan = data.ppmpf_2 || 'pro';
      const period = data.ppmpf_3 || 'monthly';

      // 3. GLITCH-FREE AUTOMATED VERIFICATION (DATABASE UPDATE)
      console.log(`JazzCash Payment Success! Order: ${orderId}, User: ${userId}, Amount: ${amountPaidStr}`);
      
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

        console.log(`Successfully upgraded user ${userId} to ${plan} with +${creditsToAdd} credits via JazzCash.`);
      }

      // Redirect the user back to the payment status page in the browser
      return NextResponse.redirect(`${baseUrl}/payment-status?pp_ResponseCode=000&pp_TxnRefNo=${orderId}`, 303);

    } else {
      // Payment Failed (e.g., insufficient funds, user cancelled)
      console.warn(`Payment Failed! Response Code: ${data.pp_ResponseCode}, Message: ${data.pp_ResponseMessage}`);
      
      return NextResponse.redirect(`${baseUrl}/payment-status?pp_ResponseCode=${data.pp_ResponseCode}&pp_ResponseMessage=${encodeURIComponent(data.pp_ResponseMessage || 'Payment Failed')}`, 303);
    }

  } catch (error) {
    console.error('JazzCash Webhook Error:', error);
    return NextResponse.redirect(`${baseUrl}/payment-status?responseCode=failed&error=internal_error`, 303);
  }
}
