import { NextResponse } from 'next/server';
import { generateEasyPaisaHash } from '../../../../utils/payment-crypto';

// Replace with actual Sandbox/Live credentials
const EASYPAISA_STORE_ID = process.env.EASYPAISA_STORE_ID || 'SANDBOX_STORE_ID';
const EASYPAISA_HASH_KEY = process.env.EASYPAISA_HASH_KEY || 'SANDBOX_HASH_KEY';
const EASYPAISA_RETURN_URL = process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/payment-status` : 'http://localhost:3000/payment-status';

export async function POST(req) {
  try {
    const body = await req.json();
    const { amount, userId, plan = 'pro', period = 'monthly' } = body;

    if (!amount || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const date = new Date();
    const expiryDate = new Date(date.getTime() + 60 * 60 * 1000);

    const formatDate = (d) => {
        // format: YYYY-MM-DDTHH:MM:SS
        return d.toISOString().slice(0, 19);
    };

    // Embed metadata: EP_userId_plan_period_timestamp
    const orderId = `EP_${userId}_${plan}_${period}_${Date.now()}`;

    // Standard EasyPaisa Hosted Checkout Request Parameters
    const paymentData = {
      storeId: EASYPAISA_STORE_ID,
      amount: String(amount.toFixed(1)), // EP often expects 1 decimal place
      postBackURL: EASYPAISA_RETURN_URL,
      orderRefNum: orderId,
      expiryDate: formatDate(expiryDate),
      merchantHashedReq: '', // Will be calculated
      autoRedirect: '1',
      paymentMethod: 'MA_PAYMENT', // Or OTC_PAYMENT, CC_PAYMENT
      emailAddress: 'test@example.com', // Optional but good to pass if available
      mobileNum: '03451234567' // Replace with user's mobile if available
    };

    // Calculate secure hash (Using generic AES implementation for demo)
    paymentData.merchantHashedReq = generateEasyPaisaHash(paymentData, EASYPAISA_HASH_KEY);

    // Note: The actual redirect URL depends on whether it's MA (Mobile Account) or Hosted Checkout portal.
    // For Sandbox Hosted Checkout, it's typically this URL:
    return NextResponse.json({
      success: true,
      gatewayUrl: 'https://easypay.easypaisa.com.pk/easypay/Index.jsf', 
      paymentData
    });

  } catch (error) {
    console.error('EasyPaisa Payment Generation Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
