'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { AppSidebar } from '@/components/AppSidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { connected } = useWallet();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const redirectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (redirectTimeoutRef.current) {
      clearTimeout(redirectTimeoutRef.current);
    }

    if (isClient && !connected) {
      redirectTimeoutRef.current = setTimeout(() => {
        router.push('/');
      }, 1000);
    }

    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, [connected, router, isClient]);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', backgroundColor: '#0a0a0a' }}>
      <AppSidebar />
      <main style={{ flex: 1, overflowY: 'auto', backgroundColor: '#0a0a0a' }}>{children}</main>
    </div>
  );
}

