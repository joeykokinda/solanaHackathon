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
      backgroundColor: 'var(--black)',
      zIndex: 50
    }}>
      <div style={{ display: 'flex', gap: '3rem', alignItems: 'center', flex: 1 }}>
        <Link href="/" style={{ 
          fontSize: '1.5rem', 
          fontWeight: 600,
          textDecoration: 'none',
          color: 'var(--white)',
          letterSpacing: '-0.01em'
        }}>
          YouVest
        </Link>
        
        <nav style={{ 
          display: 'flex', 
          gap: '2rem',
        }} className="hidden md:flex">
          <Link href="/marketplace" style={{
            textDecoration: 'none',
            color: 'var(--gray)',
            fontWeight: 500,
            transition: 'color 0.2s',
            fontSize: '0.9375rem'
          }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--white)'}
             onMouseLeave={(e) => e.currentTarget.style.color = 'var(--gray)'}>
            Marketplace
          </Link>
          <Link href="/how-it-works" style={{
            textDecoration: 'none',
            color: 'var(--gray)',
            fontWeight: 500,
            transition: 'color 0.2s',
            fontSize: '0.9375rem'
          }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--white)'}
             onMouseLeave={(e) => e.currentTarget.style.color = 'var(--gray)'}>
            How It Works
          </Link>
          <Link href="/launch" style={{
            textDecoration: 'none',
            color: 'var(--gray)',
            fontWeight: 500,
            transition: 'color 0.2s',
            fontSize: '0.9375rem'
          }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--white)'}
             onMouseLeave={(e) => e.currentTarget.style.color = 'var(--gray)'}>
            Launch Token
          </Link>
          <Link href="/portfolio" style={{
            textDecoration: 'none',
            color: 'var(--gray)',
            fontWeight: 500,
            transition: 'color 0.2s',
            fontSize: '0.9375rem'
          }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--white)'}
             onMouseLeave={(e) => e.currentTarget.style.color = 'var(--gray)'}>
            Portfolio
          </Link>
        </nav>
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <WalletMultiButton />
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden"
          style={{ color: 'var(--white)', background: 'none', border: 'none', cursor: 'pointer' }}
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
          backgroundColor: 'var(--black-card)',
          borderBottom: '1px solid var(--border)',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }} className="md:hidden">
          <Link href="/marketplace" style={{ color: 'var(--gray)', padding: '0.5rem' }}>Marketplace</Link>
          <Link href="/how-it-works" style={{ color: 'var(--gray)', padding: '0.5rem' }}>How It Works</Link>
          <Link href="/launch" style={{ color: 'var(--gray)', padding: '0.5rem' }}>Launch Token</Link>
          <Link href="/portfolio" style={{ color: 'var(--gray)', padding: '0.5rem' }}>Portfolio</Link>
        </div>
      )}
    </header>
  );
}
