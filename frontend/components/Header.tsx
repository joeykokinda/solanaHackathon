'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header style={{
      borderBottom: '1px solid var(--border)',
      padding: '1rem 1.5rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      backgroundColor: 'rgba(10, 14, 39, 0.8)',
      backdropFilter: 'blur(12px)',
      zIndex: 50
    }}>
      <div style={{ display: 'flex', gap: '3rem', alignItems: 'center', flex: 1 }}>
        <Link href="/" style={{ 
          fontSize: '1.5rem', 
          fontWeight: 700,
          textDecoration: 'none',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            display: 'inline-block'
          }} />
          YouVest
        </Link>
        
        <nav style={{ 
          display: 'flex', 
          gap: '2rem',
          '@media (max-width: 768px)': { display: 'none' }
        }} className="hidden md:flex">
          <Link href="/marketplace" style={{
            textDecoration: 'none',
            color: 'var(--text-secondary)',
            fontWeight: 500,
            transition: 'color 0.2s'
          }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
             onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>
            Marketplace
          </Link>
          <Link href="/how-it-works" style={{
            textDecoration: 'none',
            color: 'var(--text-secondary)',
            fontWeight: 500,
            transition: 'color 0.2s'
          }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
             onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>
            How It Works
          </Link>
          <Link href="/launch" style={{
            textDecoration: 'none',
            color: 'var(--text-secondary)',
            fontWeight: 500,
            transition: 'color 0.2s'
          }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
             onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>
            Launch Token
          </Link>
          <Link href="/portfolio" style={{
            textDecoration: 'none',
            color: 'var(--text-secondary)',
            fontWeight: 500,
            transition: 'color 0.2s'
          }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
             onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>
            Portfolio
          </Link>
        </nav>
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <WalletMultiButton />
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden"
          style={{ color: 'var(--text-primary)', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }} className="md:hidden">
          <Link href="/marketplace" style={{ color: 'var(--text-secondary)', padding: '0.5rem' }}>Marketplace</Link>
          <Link href="/how-it-works" style={{ color: 'var(--text-secondary)', padding: '0.5rem' }}>How It Works</Link>
          <Link href="/launch" style={{ color: 'var(--text-secondary)', padding: '0.5rem' }}>Launch Token</Link>
          <Link href="/portfolio" style={{ color: 'var(--text-secondary)', padding: '0.5rem' }}>Portfolio</Link>
        </div>
      )}
    </header>
  );
}
