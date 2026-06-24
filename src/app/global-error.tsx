'use client';

import { useEffect } from 'react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex" />
        <title>Error — BYGG I SYD</title>
      </head>
      <body style={{
        backgroundColor: '#080908',
        color: '#f0ebe0',
        fontFamily: 'system-ui, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        margin: 0,
        padding: '24px',
      }}>
        <div style={{ textAlign: 'center', maxWidth: '500px' }}>
          <h1 style={{ fontSize: '4rem', margin: '0 0 16px', opacity: 0.3 }}>500</h1>
          <h2 style={{ fontSize: '1.5rem', margin: '0 0 16px', fontWeight: 400 }}>
            Something went wrong
          </h2>
          <p style={{ color: '#a3a3a3', margin: '0 0 32px', lineHeight: 1.6 }}>
            A critical error occurred. Please try refreshing the page.
          </p>
          <button
            onClick={reset}
            style={{
              padding: '12px 32px',
              background: 'linear-gradient(135deg, #e2d2b5, #c4a96a)',
              color: '#080908',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 500,
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
