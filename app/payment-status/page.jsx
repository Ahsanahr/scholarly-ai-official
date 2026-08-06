'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function PaymentStatusContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const responseCode = searchParams.get('pp_ResponseCode') || searchParams.get('responseCode');
    
    if (responseCode === '000' || responseCode === '0000') {
      setStatus('success');
    } else if (responseCode) {
      setStatus('failed');
    } else {
      setStatus('unknown');
    }
  }, [searchParams]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {status === 'loading' && (
          <>
            <div style={styles.spinner} />
            <h2 style={styles.title}>Verifying Payment...</h2>
            <p style={styles.subtitle}>Please wait while we confirm with the gateway.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={styles.iconSuccess}>✓</div>
            <h2 style={styles.title}>Payment Successful!</h2>
            <p style={styles.subtitle}>Thank you for your purchase. Your account has been upgraded.</p>
            <button style={styles.button} onClick={() => router.push('/dashboard')}>
              Go to Dashboard
            </button>
          </>
        )}

        {status === 'failed' && (
          <>
            <div style={styles.iconFailed}>✕</div>
            <h2 style={styles.title}>Payment Failed</h2>
            <p style={styles.subtitle}>Unfortunately, your transaction could not be completed.</p>
            <button style={styles.buttonOutline} onClick={() => router.push('/checkout')}>
              Try Again
            </button>
          </>
        )}

        {status === 'unknown' && (
          <>
            <h2 style={styles.title}>Status Unknown</h2>
            <p style={styles.subtitle}>No payment status was found in the URL. If you paid, it will be updated shortly.</p>
            <button style={styles.buttonOutline} onClick={() => router.push('/dashboard')}>
              Return to Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function PaymentStatusPage() {
  return (
    <Suspense fallback={<div style={styles.container}><h2 style={styles.title}>Loading...</h2></div>}>
      <PaymentStatusContent />
    </Suspense>
  );
}

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
    padding: '50px 40px',
    width: '100%',
    maxWidth: '400px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center'
  },
  title: {
    margin: '20px 0 10px 0',
    fontSize: '24px',
    fontWeight: '700'
  },
  subtitle: {
    margin: '0 0 30px 0',
    color: '#94a3b8',
    fontSize: '15px',
    lineHeight: '1.5'
  },
  iconSuccess: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: '#10b981', // green
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px',
    color: '#fff',
    boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4)'
  },
  iconFailed: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: '#ef4444', // red
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px',
    color: '#fff',
    boxShadow: '0 10px 25px -5px rgba(239, 68, 68, 0.4)'
  },
  button: {
    width: '100%',
    padding: '16px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, #38bdf8 0%, #2563eb 100%)',
    border: 'none',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.1s ease',
  },
  buttonOutline: {
    width: '100%',
    padding: '16px',
    borderRadius: '16px',
    background: 'transparent',
    border: '2px solid #64748b',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid rgba(255,255,255,0.1)',
    borderTopColor: '#38bdf8',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  }
};

// Add keyframes for spinner (doing it via a style tag since Next.js supports regular css, but this is a quick inline hack for the component)
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.innerText = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(styleSheet);
}
