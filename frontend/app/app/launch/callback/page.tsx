'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function YouTubeCallback() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (window.opener) {
      if (error) {
        window.opener.postMessage({ type: 'youtube-auth-error', error }, window.location.origin);
      } else if (code) {
        window.opener.postMessage({ type: 'youtube-auth-code', code }, window.location.origin);
      }
      window.close();
    }
  }, [searchParams]);

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      backgroundColor: '#0a0a0a',
      color: 'white'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h2>Verifying YouTube account...</h2>
        <p style={{ color: '#9ca3af', marginTop: '0.5rem' }}>This window will close automatically</p>
      </div>
    </div>
  );
}

