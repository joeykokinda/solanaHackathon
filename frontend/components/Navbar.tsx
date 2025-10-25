'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href || (href === '/' && pathname === '/');
  
  return (
    <Link 
      href={href}
      style={{
        fontSize: '0.875rem',
        fontWeight: 500,
        color: isActive ? '#ffffff' : '#9ca3af',
        textDecoration: 'none',
        transition: 'color 0.15s ease'
      }}
      onMouseEnter={(e) => !isActive && (e.currentTarget.style.color = '#ffffff')}
      onMouseLeave={(e) => !isActive && (e.currentTarget.style.color = '#9ca3af')}
    >
      {children}
    </Link>
  );
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav style={{
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      backgroundColor: 'rgba(0, 0, 0, 0.95)',
      backdropFilter: 'blur(12px)',
      height: '64px',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 1rem',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link href="/" style={{ 
            fontSize: '1.25rem', 
            fontWeight: 600,
            color: '#ffffff',
            textDecoration: 'none',
            letterSpacing: '-0.025em'
          }}>
            YouVest
          </Link>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: '1.5rem'
          }} className="hidden md:flex">
            <NavLink href="/">Markets</NavLink>
            <NavLink href="/portfolio">Portfolio</NavLink>
            <NavLink href="/launch">Launch</NavLink>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <WalletMultiButton />
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
            style={{ 
              color: '#ffffff', 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div style={{
            position: 'fixed',
            top: '64px',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.98)',
            backdropFilter: 'blur(12px)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            zIndex: 40
          }} className="md:hidden">
            <Link 
              href="/" 
              style={{ 
                padding: '1rem', 
                color: '#ffffff',
                fontSize: '1.125rem',
                fontWeight: 500,
                textDecoration: 'none'
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Markets
            </Link>
            <Link 
              href="/portfolio" 
              style={{ 
                padding: '1rem', 
                color: '#ffffff',
                fontSize: '1.125rem',
                fontWeight: 500,
                textDecoration: 'none'
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Portfolio
            </Link>
            <Link 
              href="/launch" 
              style={{ 
                padding: '1rem', 
                color: '#ffffff',
                fontSize: '1.125rem',
                fontWeight: 500,
                textDecoration: 'none'
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Launch
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

