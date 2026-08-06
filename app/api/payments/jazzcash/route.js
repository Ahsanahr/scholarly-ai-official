import { NextResponse } from 'next/server';
import { generateJazzCashHash } from '../../../../utils/payment-crypto';

// Replace with your actual Sandbox/Live credentials from .env.local
const JAZZCASH_MERCHANT_ID = process.env.JAZZCASH_MERCHANT_ID || 'SANDBOX_MERCHANT_ID';
const JAZZCASH_PASSWORD = process.env.JAZZCASH_PASSWORD || 'SANDBOX_PASSWORD';
const JAZZCASH_INTEGRITY_SALT = process.env.JAZZCASH_INTEGRITY_SALT || 'SANDBOX_SALT';
const JAZZCASH_RETURN_URL = process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/jazzcash` : 'http://localhost:3000/api/webhooks/jazzcash';

export async function POST(req) {
  try {
    const body = await req.json();
    const { amount, itemDescription, userId, plan = 'pro', period = 'monthly' } = body;

    if (!amount || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Format Date and Time as required by JazzCash (YYYYMMDDHHMMSS)
    const date = new Date();
    const expiryDate = new Date(date.getTime() + 60 * 60 * 1000); // 1 hour expiry

    const formatDate = (d) => d.toISOString().replace(/[-:T]/g, '').slice(0, 14);

    const txnRefNo = `TXN${formatDate(date)}${Math.floor(Math.random() * 1000)}`;

    const paymentData = {
      pp_Version: '1.1',
      pp_TxnType: 'MWALLET', // MWALLET for Mobile Account, or use specific codes for Cards
      pp_Language: 'EN',
      pp_MerchantID: JAZZCASH_MERCHANT_ID,
      pp_SubMerchantID: '',
      pp_Password: JAZZCASH_PASSWORD,
      pp_BankID: 'TBANK',
      pp_ProductID: 'RETL',
      pp_TxnRefNo: txnRefNo,
      pp_Amount: String(Math.round(amount) * 100), // Amount in paisas (e.g. 100 PKR = 10000 paisas)
      pp_TxnCurrency: 'PKR',
      pp_TxnDateTime: formatDate(date),
      pp_BillReference: itemDescription || 'Scolary AI Credits',
      pp_Description: 'Payment for Scolary AI',
      pp_TxnExpiryDateTime: formatDate(expiryDate),
      pp_ReturnURL: JAZZCASH_RETURN_URL,
      pp_SecureHash: '', // Will be calculated below
      ppmpf_1: userId, // Pass userId as custom field 1 so we get it back in webhook
      ppmpf_2: plan,   // Pass plan as custom field 2
      ppmpf_3: period, // Pass period as custom field 3
      ppmpf_4: '',
      ppmpf_5: ''
    };

    // Generate secure hash
    paymentData.pp_SecureHash = generateJazzCashHash(paymentData, JAZZCASH_INTEGRITY_SALT);

    return NextResponse.json({
      success: true,
      gatewayUrl: 'https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/',
      paymentData
    });

  } catch (error) {
    console.error('JazzCash Payment Generation Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
