'use client';

import Link from 'next/link';
import { Twitter, Github, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      marginTop: '5rem',
      padding: '3rem 1.5rem 2rem'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '3rem',
          marginBottom: '3rem'
        }}>
          <div>
            <h4 style={{ fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>
              YouVest
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Invest in creators before they blow up
            </p>
          </div>

          <div>
            <h4 style={{ fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Product
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link href="/marketplace" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                Marketplace
              </Link>
              <Link href="/how-it-works" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                How It Works
              </Link>
              <Link href="/launch" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                Launch Token
              </Link>
            </div>
          </div>

          <div>
            <h4 style={{ fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Company
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <a href="#" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>About</a>
              <a href="#" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Blog</a>
              <a href="#" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Docs</a>
            </div>
          </div>

          <div>
            <h4 style={{ fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Social
            </h4>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="#" style={{ color: 'var(--text-secondary)' }}>
                <Twitter size={20} />
              </a>
              <a href="#" style={{ color: 'var(--text-secondary)' }}>
                <MessageCircle size={20} />
              </a>
              <a href="#" style={{ color: 'var(--text-secondary)' }}>
                <Github size={20} />
              </a>
            </div>
          </div>
        </div>

        <div style={{ 
          paddingTop: '2rem', 
          borderTop: '1px solid var(--border)',
          textAlign: 'center',
          color: 'var(--text-tertiary)',
          fontSize: '0.875rem'
        }}>
          © 2025 YouVest. Built on Solana.
        </div>
      </div>
    </footer>
  );
}

