'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { usePathname } from 'next/navigation';
import { TrendingUp, Wallet, Rocket, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';

export function AppSidebar() {
  const { publicKey, disconnect } = useWallet();
  const pathname = usePathname();
  const [userCreator, setUserCreator] = useState<any>(null);
  const [loadingCreator, setLoadingCreator] = useState(true);

  useEffect(() => {
    if (publicKey) {
      fetch(`http://localhost:3001/api/creators`)
        .then(res => res.json())
        .then(data => {
          const creator = data.creators?.find((c: any) => 
            c.userId && c.tokenAddress && !c.tokenAddress.startsWith('TOKEN')
          );
          setUserCreator(creator);
          setLoadingCreator(false);
        })
        .catch(() => setLoadingCreator(false));
    }
  }, [publicKey]);

  const links = [
    { label: 'Markets', href: '/app', icon: TrendingUp },
    { label: 'Portfolio', href: '/app/portfolio', icon: Wallet },
    userCreator 
      ? { label: 'Your Token', href: `/app/creator/${userCreator.id}`, icon: Rocket }
      : { label: 'Launch', href: '/app/launch', icon: Rocket },
  ];

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <div style={{
      width: '240px',
      height: '100vh',
      backgroundColor: '#0a0a0a',
      borderRight: '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      padding: '1rem',
    }}>
      <a href="/app" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '1rem 0',
        marginBottom: '2rem',
        textDecoration: 'none',
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          backgroundColor: 'white',
          borderRadius: '8px',
        }} />
        <span style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          color: 'white',
        }}>YouVest</span>
      </a>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <a
              key={link.href}
              href={link.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                color: 'white',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <Icon size={20} />
              <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{link.label}</span>
            </a>
          );
        })}
      </div>

      <div style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        paddingTop: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}>
        {publicKey && (
          <div style={{
            padding: '0.75rem',
            borderRadius: '0.5rem',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>
              Connected
            </div>
            <div style={{
              fontSize: '0.875rem',
              color: 'white',
              fontFamily: 'monospace',
            }}>
              {shortenAddress(publicKey.toString())}
            </div>
          </div>
        )}

        <button
          onClick={() => disconnect()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#f87171',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: 500,
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(248, 113, 113, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <LogOut size={20} />
          <span>Disconnect</span>
        </button>
      </div>
    </div>
  );
}

