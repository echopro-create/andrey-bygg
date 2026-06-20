'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Page error:', error);
  }, [error]);

  return (
    <div className="error-page section-spacing">
      <div className="container" style={{ textAlign: 'center', maxWidth: '600px' }}>
        <h1 className="section-title" style={{ marginBottom: '24px' }}>
          Something went wrong
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '40px', lineHeight: 1.6 }}>
          An unexpected error occurred. Please try again or return to the homepage.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={reset} className="btn btn-primary">
            Try again
          </button>
          <Link href="/" className="btn btn-secondary">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
