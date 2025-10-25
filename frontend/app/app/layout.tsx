'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AppSidebar } from '@/components/AppSidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { connected } = useWallet();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !connected) {
      router.push('/');
    }
  }, [connected, router, isClient]);

  if (!isClient || !connected) {
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

