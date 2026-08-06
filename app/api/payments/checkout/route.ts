import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { adminAuth } from '@/lib/firebase-admin';

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

    if (!['monthly', 'quarterly', 'yearly'].includes(period)) {
      return NextResponse.json({ error: 'Invalid billing period selected' }, { status: 400 });
    }

    const pricingTable: any = {
      pro: { monthly: 420, quarterly: 1120, yearly: 3360 },
      premier: { monthly: 1260, quarterly: 3360, yearly: 10000 }
    };

    const amount = pricingTable[plan][period];
    const order_id = `ORDER_${crypto.randomBytes(8).toString('hex').toUpperCase()}`;

    // Payload for the payment aggregator (e.g., PayFast/Safepay)
    const payload = {
      order_id,
      amount,
      currency: 'PKR',
      user_id: decodedToken.uid,
      plan,
      period,
      timestamp: Date.now(),
    };

    // Hash the payload using HMAC SHA-256 to ensure data integrity
    const secret = process.env.PAYMENT_GATEWAY_SECRET || 'scholarly_jwt_secret_key_2026_pk';


    const payloadString = JSON.stringify(payload);
    const signature = crypto
      .createHmac('sha256', secret)
      .update(payloadString)
      .digest('hex');

    // Return the checkout URL along with the signed payload
    const paymentGatewayUrl = process.env.PAYMENT_GATEWAY_URL || '/payment-gateway.html';
    
    return NextResponse.json({
      checkoutUrl: paymentGatewayUrl,
      payload,
      signature
    });
  } catch (error: any) {
    console.error('Checkout Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
