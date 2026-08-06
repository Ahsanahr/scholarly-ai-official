'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Dummy user ID and Amount for demonstration
  const userId = 'user_12345';
  const amount = 500; // 500 PKR

  const handlePayment = async () => {
    if (!selectedMethod) {
      setError('Please select a payment method');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create request to our Next.js API route
      const response = await fetch(`/api/payments/${selectedMethod}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          userId,
          itemDescription: '500 AI Credits - Scolary Pro'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate payment request');
      }

      // We have the secure payload and the Gateway URL.
      // We must submit this data as a POST form to the Gateway.
      submitFormToGateway(data.gatewayUrl, data.paymentData);

    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred during checkout.');
      setLoading(false);
    }
  };

  // Dynamically creates a form and submits it to redirect the user to JazzCash/EasyPaisa
  const submitFormToGateway = (url, paymentData) => {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = url;
    form.style.display = 'none';

    for (const key in paymentData) {
      if (paymentData.hasOwnProperty(key)) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = paymentData[key];
        form.appendChild(input);
      }
    }

    document.body.appendChild(form);
    form.submit();
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Complete Your Purchase</h1>
        <p style={styles.subtitle}>Scolary AI Pro - 500 Credits</p>

        <div style={styles.priceContainer}>
          <span style={styles.currency}>PKR</span>
          <span style={styles.amount}>{amount}</span>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <h3 style={styles.methodTitle}>Select Payment Method</h3>
        
        <div style={styles.methodsGrid}>
          <div 
            style={{...styles.methodCard, ...(selectedMethod === 'jazzcash' ? styles.selectedMethod : {})}}
            onClick={() => setSelectedMethod('jazzcash')}
          >
            <div style={styles.radio}>
              {selectedMethod === 'jazzcash' && <div style={styles.radioInner} />}
            </div>
            <span style={styles.methodText}>JazzCash</span>
          </div>

          <div 
            style={{...styles.methodCard, ...(selectedMethod === 'easypaisa' ? styles.selectedMethod : {})}}
            onClick={() => setSelectedMethod('easypaisa')}
          >
             <div style={styles.radio}>
              {selectedMethod === 'easypaisa' && <div style={styles.radioInner} />}
            </div>
            <span style={styles.methodText}>EasyPaisa</span>
          </div>
        </div>

        <button 
          style={{...styles.payButton, ...(loading ? styles.payButtonDisabled : {})}} 
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? 'Processing...' : `Pay PKR ${amount}`}
        </button>

        <p style={styles.secureText}>
          🔒 Secure Encrypted Local Transaction
        </p>
      </div>
    </div>
  );
}

// Premium CSS-in-JS styles
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    fontFamily: '"Inter", "Roboto", sans-serif',
    padding: '20px'
  },
  card: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: '40px',
    width: '100%',
    maxWidth: '450px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  title: {
    margin: '0 0 10px 0',
    fontSize: '24px',
    fontWeight: '700',
    textAlign: 'center'
  },
  subtitle: {
    margin: '0 0 30px 0',
    color: '#94a3b8',
    fontSize: '15px'
  },
  priceContainer: {
    display: 'flex',
    alignItems: 'baseline',
    marginBottom: '40px'
  },
  currency: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#38bdf8',
    marginRight: '8px'
  },
  amount: {
    fontSize: '48px',
    fontWeight: '800',
    letterSpacing: '-1px'
  },
  methodTitle: {
    width: '100%',
    textAlign: 'left',
    fontSize: '14px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: '#94a3b8',
    marginBottom: '15px'
  },
  methodsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    width: '100%',
    marginBottom: '30px'
  },
  methodCard: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 20px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  selectedMethod: {
    background: 'rgba(56, 189, 248, 0.1)',
    border: '1px solid #38bdf8',
  },
  radio: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    border: '2px solid #64748b',
    marginRight: '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  radioInner: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: '#38bdf8'
  },
  methodText: {
    fontSize: '16px',
    fontWeight: '500'
  },
  payButton: {
    width: '100%',
    padding: '16px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, #38bdf8 0%, #2563eb 100%)',
    border: 'none',
    color: '#fff',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.1s ease',
    boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)'
  },
  payButtonDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed'
  },
  error: {
    background: 'rgba(239, 68, 68, 0.1)',
    color: '#ef4444',
    padding: '12px',
    borderRadius: '8px',
    width: '100%',
    marginBottom: '20px',
    textAlign: 'center',
    fontSize: '14px',
    border: '1px solid rgba(239, 68, 68, 0.3)'
  },
  secureText: {
    marginTop: '20px',
    fontSize: '12px',
    color: '#64748b'
  }
};
